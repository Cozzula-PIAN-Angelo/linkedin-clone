import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { JobItem } from "./types";

interface RemotiveJob {
  id: number;
  title: string;
  company_name: string;
  company_logo: string | null;
  candidate_required_location: string;
  job_type: string;
  url: string;
  publication_date: string;
}

interface RemotiveResponse {
  jobs: RemotiveJob[];
}

function mapJob(job: RemotiveJob): JobItem {
  return {
    id: job.id,
    title: job.title,
    company: job.company_name,
    companyLogo: job.company_logo ?? undefined,
    location: job.candidate_required_location,
    jobType: job.job_type,
    url: job.url,
    publicationDate: job.publication_date,
  };
}

export const jobsApi = createApi({
  reducerPath: "jobsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://remotive.com/api/" }),
  endpoints: (builder) => ({
    // L'API di Remotive ignora il parametro "search" lato server (risposta
    // identica con o senza), quindi prendiamo un pool ampio una sola volta
    // e filtriamo lato client in JobsPage in base al testo digitato.
    getRemoteJobs: builder.query<JobItem[], void>({
      query: () => ({
        url: "remote-jobs",
        params: { limit: 200 },
      }),
      transformResponse: (response: RemotiveResponse) =>
        response.jobs.map(mapJob),
    }),
  }),
});

export const { useGetRemoteJobsQuery, useLazyGetRemoteJobsQuery } = jobsApi;
