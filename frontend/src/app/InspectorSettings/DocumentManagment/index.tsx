import ContentSection from "@/components/content-section"
import { useInspectorDetails } from "@/hooks/useInspectorDetails"
import { DocumentList } from "./components/DocumentList"
import LoadingSpinner from "@/components/LoadingSpinner"

const DocumentManagment = () => {
    const { inspector, loading } = useInspectorDetails()
    return (<>

        <ContentSection
            title='Your Documents'
            desc='Manage your documents - upload, view, edit, and download files.'
            scrollAreaClassName=""
        >

            {loading ? <LoadingSpinner /> : <DocumentList initialDocuments={inspector.certificates} />}

        </ContentSection>

    </>
    )
}

export default DocumentManagment