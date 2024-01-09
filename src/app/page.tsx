import JobListItem from "@/components/JobListItem";
import JobResults from "@/components/JobResults";
import ShopFilterSide from "@/components/ShopFilterSide";
import H1 from "@/components/ui/h1";
import { JobFilterValues } from "@/lib/Validation";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
interface PageProps {
  searchParams: {
    q?: string;
    type?: string;
    location?: string;
    remote?: string;
    page?: string;
  };
}
export default async function Home({
  searchParams: { q, type, location, remote, page },
}: PageProps) {
  const filterValues: JobFilterValues = {
    q,
    type,
    location,
    remote: remote === "true",
  };

  return (
    <main className="m-auto my-10 max-w-5xl space-y-10 px-3">
      <div className="space-y-5 text-center">
        <H1>Developer jobs</H1>
        <p className="text-muted-foreground">Find your dream job</p>
      </div>
      <section className="flex flex-col gap-4 md:flex-row">
        <ShopFilterSide defaltValues={filterValues} />
        <JobResults
          page={page ? parseInt(page) : undefined}
          filterValues={filterValues}
        />
      </section>
    </main>
  );
}
