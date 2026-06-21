"use client";

import { usePipelineStore } from "@/store/pipelineStore";
import { useEffect, use } from "react";
import PipelineEditor from "@/components/pipeline/PipelineEditor";
import { Loader } from "@/components/loader";
import { ErrorDisplay } from "@/components/error";

type Props = {
    params: Promise<{ id: string }>;
}

export default function PipelineDetailsPage({ params }: Props) {
    const { id } = use(params);
    const { isLoading, error, loadPipeline } = usePipelineStore();

    useEffect(() => {
        if (id) {
            loadPipeline(id);
        }
    }, [id, loadPipeline]);

    if (isLoading) {
        return <div className="flex flex-col items-center justify-center h-screen">
            <Loader />
        </div>
    }

    if (error) {
        return <div className="flex flex-col items-center justify-center h-screen">
            <ErrorDisplay message={error} />
        </div>
    }

    return <PipelineEditor />
}