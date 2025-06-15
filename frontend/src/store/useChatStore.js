import { create } from "zustand";
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,   //nguoi dung duoc chon
    isUsersLoading: false,
    isMessagesLoading: false,
    

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/message/users");
            set({ users: res.data });
            //toast.success("Get users successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({ messages: res.data});

        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get(); //lay tin nhat hien tai
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
            //set({ messages: res});
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },


    subscribeToMessages: () => {
        const { selectedUser } = get();
        if(!selectedUser){
            return;
        }

        const socket = useAuthStore.getState().socket;

        socket.on("newMessages", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id

            if(!isMessageSentFromSelectedUser){
                return;
            }
            set({
                messages: [...get().messages, newMessage],
            });
        })
    },
    
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessages");
    },

    

    setSelectedUser: (selectedUser) => set({ selectedUser }),

}));


