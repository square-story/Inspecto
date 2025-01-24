import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"

const BackButton = () => {
    const navigate = useNavigate()
    return (
        <div className="flex justify-start items-start w-full pb-5" onClick={() => navigate(-1)}>
            <Button variant='secondary' className="rounded-full">Back</Button>
        </div>
    )
}

export default BackButton