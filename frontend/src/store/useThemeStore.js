import { create } from "zustand";

// export const useThemeStore = create((set) => ({
//     theme: localStorage.getItem("chat-theme") || "coffee",
//     setTheme: (theme) => {
//         localStorage.setItem("chat-theme", theme);
//         set({ theme });
//     }
// }));

export const useThemeStore = create((set) => {
    return {
        theme: localStorage.getItem("chat-theme") || "dracula",
        setTheme: (theme) => {
            localStorage.setItem("chat-theme", theme);
            set({ theme });
        },
    };
});
