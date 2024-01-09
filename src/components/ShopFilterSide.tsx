import { jobTypes } from "@/lib/JobTypes";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Select from "./ui/select";
import { Button } from "./ui/button";
import { JobFilterSchema, JobFilterValues } from "@/lib/Validation";
import { redirect } from "next/navigation";
import JobSubmit from "./JobSubmit";
Input;
async function filterJobs(formData: FormData) {
  "use server";
  const values = Object.fromEntries(formData.entries());
  const parsedValues = JobFilterSchema.parse(values);
  const { q, type, location, remote } = parsedValues;
  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
    ...(type && { type }),
    ...(location && { location }),
    ...(remote && { remote: "true" }),
  });
  redirect(`/?${searchParams}`);
}
interface ShopFilterProps {
  defaltValues: JobFilterValues
}
const ShopFilterSide = async ({defaltValues} : ShopFilterProps) => {
  const distinctLocations = (await prisma?.job
    .findMany({
      where: { approved: true },
      select: { location: true },
      distinct: ["location"],
    })
    .then((locations) =>
      locations.map(({ location }) => location).filter(Boolean),
    )) as string[];
  console.log(distinctLocations);
  return (
    <aside
      className="
        sticky
        top-0
        h-fit
        rounded-lg
        border
        bg-background
        p-4   
        md:w-[260px]
        "
    >
      <form action={filterJobs}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Search</Label>
            <Input defaultValue={defaltValues.q} name="q" id="q" placeholder="Title, company, etc." />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Type</Label>
            <Select id="type" name="type" defaultValue={defaltValues.type || ""}>
              <option value="">All locations</option>
              {jobTypes.map((location) => {
                return (
                  <option key={location} value={location}>
                    {" "}
                    {location}{" "}
                  </option>
                );
              })}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <Select id="location" defaultValue={defaltValues.location || ""} name="location">
              <option value="">All locations</option>
              {distinctLocations.map((location) => {
                return (
                  <option key={location} value={location}>
                    {" "}
                    {location}{" "}
                  </option>
                );
              })}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="remote"
              name="remote"
              type="checkbox"
              className="scale-125 accent-black"
              defaultChecked={defaltValues.remote}
            />
            <Label htmlFor="remote">Remote jobs</Label>
          </div>
          <JobSubmit className="w-full">Filter</JobSubmit>
        </div>
      </form>
    </aside>
  );
};

export default ShopFilterSide;
