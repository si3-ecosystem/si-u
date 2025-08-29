"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/redux/store";
import { apiClient } from "@/services/api";
import { initializeUser } from "@/redux/slice/userSlice";
import { store } from "@/redux/store";
import { AuthDebugger } from "@/utils/debugAuth";

/**
 * Simplified hook to initialize authentication state from server
 * Relies on server-side authentication via cookies
 */
export function useAuthInitializer() {
    const currentUser = useAppSelector((state) => state.user);

    useEffect(() => {
        console.log("[useAuthInitializer] Effect triggered:", {
            isInitialized: currentUser.isInitialized,
            hasUser: !!currentUser.user,
            userId: currentUser.user?._id,
            userEmail: currentUser.user?.email,
        });

        // Always fetch fresh data from server to ensure we have the latest user information
        // This solves refresh issues and ensures data is always up-to-date
        console.log(
            "[useAuthInitializer] Fetching fresh user data from server..."
        );

        // Simple server-side auth check
        const initializeAuth = async () => {
            try {
                console.log(
                    "[useAuthInitializer] Fetching user data from server..."
                );

                // Try to get user data from server using cookies
                const response = await apiClient.get("/auth/me");

                console.log(
                    "[useAuthInitializer] Full response object:",
                    response
                );
                console.log(
                    "[useAuthInitializer] Response.data:",
                    response.data
                );
                console.log(
                    "[useAuthInitializer] Response keys:",
                    Object.keys(response)
                );
                console.log(
                    "[useAuthInitializer] Response.data keys:",
                    response.data ? Object.keys(response.data) : "no data"
                );

                // Check different possible response structures
                const userData =
                    response.data?.user ||
                    response.data?.data?.user ||
                    response.data;
                console.log(
                    "[useAuthInitializer] Extracted user data:",
                    userData
                );

                if (userData && userData.id) {
                    console.log(
                        "[useAuthInitializer] Found user data with id:",
                        userData.id
                    );

                    // Normalize user data - ensure _id field exists (server returns 'id')
                    const normalizedUserData = {
                        ...userData,
                        _id: userData._id || userData.id, // Map 'id' to '_id' if needed
                    };

                    console.log(
                        "[useAuthInitializer] Normalized user data:",
                        normalizedUserData
                    );
                    console.log(
                        "[useAuthInitializer] Server auth successful, user found:",
                        normalizedUserData.email
                    );

                    // Initialize user in Redux store
                    store.dispatch(initializeUser(normalizedUserData));
                } else {
                    console.log(
                        "[useAuthInitializer] No valid user data from server"
                    );
                    console.log(
                        "[useAuthInitializer] Response structure did not match expected format"
                    );
                    // Initialize as not logged in
                    store.dispatch(initializeUser({}));
                }
            } catch (error) {
                console.log(
                    "[useAuthInitializer] Server auth failed, user not authenticated:",
                    error.message
                );

                // CRITICAL: If token is invalid, clear it immediately
                if (
                    error.message.includes("no longer exists")
                ) {
                    console.log(
                        "[useAuthInitializer] Invalid token detected - clearing cookies and forcing logout"
                    );

                    // Clear the invalid cookie that's causing middleware confusion
                    document.cookie =
                        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    document.cookie =
                        "si3-jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

                    localStorage.removeItem("si3-jwt");
                    localStorage.removeItem("token");

                    // Force a hard redirect to break any middleware caching
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 100);

                    return; // Don't dispatch initializeUser
                }
                // Initialize as not logged in
                store.dispatch(initializeUser({}));
            }
        };

        initializeAuth();
    }, []); // Run once on mount to always fetch fresh data

    return {
        isInitialized: currentUser.isInitialized,
    };
}
