import { useNavigate } from "react-router-dom"

export const Logo = () => {
    const navHandler = useNavigate();
    return (
        <>
            <h1 onClick={() => navHandler('/')} className="text-2xl font-bold cursor-pointer">
                Inspecto
            </h1>
        </>
    );
};

