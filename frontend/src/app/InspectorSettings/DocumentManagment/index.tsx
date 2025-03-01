import ContentSection from "@/components/content-section"
import { useInspectorDetails } from "@/hooks/useInspectorDetails"
import { DocumentList } from "./components/DocumentList"

const DocumentManagment = () => {
    const { inspector } = useInspectorDetails()
    return (<>

        <ContentSection
            title='Your Documents'
            desc='Manage your documents - upload, view, edit, and download files.'
            scrollAreaClassName=""
        >

            <DocumentList initialDocuments={inspector.certificates} />

        </ContentSection>

    </>
    )
}

export default DocumentManagment