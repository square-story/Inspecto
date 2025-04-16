import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface SocketContextType {
    socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { accessToken } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!accessToken) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        // Create socket connection with auth token
        const newSocket = io(import.meta.env.VITE_API_URL, {
            auth: {
                token: accessToken
            }
        });

        // Add connection listeners
        newSocket.on('connect', () => {
            console.log('Socket connectedfdsjkdfs');
        });

        newSocket.on('notification', (data) => {
            console.log('data is :', data)
        })

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        newSocket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [accessToken]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};