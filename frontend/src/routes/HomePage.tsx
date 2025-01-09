import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    const handleSignIn = () => {
        navigate("/user/login")
    }
    return (<>
        <div className="flex justify-center bg-black w-full h-screen items-center">
            <button className="text-white" onClick={handleSignIn}>SignIn</button>
        </div>
    </>
    )
}

export default HomePage