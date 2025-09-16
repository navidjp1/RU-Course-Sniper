import { auth } from "./firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    deleteUser,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    linkWithCredential,
} from "firebase/auth";
import { registerUser } from "../api/registerData";
import { toast } from "sonner";

export const signUp = async (username, email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        updateProfile(auth.currentUser, { displayName: username }).catch((error) => {
            console.error("Could not update user display name: ", error);
        });

        const response = await registerUser(auth.currentUser.uid);
        if (response.status !== 200) throw new Error("Error registering user in DB");

        // Wait for an additional moment to ensure DB operations complete
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return { status: 200, message: "Successfully signed up!" };
    } catch (error) {
        console.error("Error signing up: ", error);
        return { status: 500, message: "Error signing up" };
    }
};

export const signIn = async (email, password) => {
    try {
        return signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.log("Error signing in: ", error);
        toast.error("There was an error in the system. Try again later.");
    }
};

export const signInWithGoogle = async () => {
    try {
        const provider = await new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;

        if (user.metadata.creationTime === user.metadata.lastSignInTime) {
            //const response = await registerUser(auth.currentUser.uid);
            const response = await registerUser(user.uid);
            if (response.status !== 200) throw new Error("Error registering user in DB");

            // Wait for DB operations to complete
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    } catch (error) {
        if (error.code === "auth/popup-closed-by-user") return;
        console.log("Error signing in with Google: ", error);
        toast.error("There was an error in the system. Try again later.");
    }
};

export const doSignOut = () => {
    return auth.signOut();
};

export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
    return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
    return sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/home`,
    });
};

export const reauthenticateUser = async (password) => {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, password);
    try {
        await reauthenticateWithCredential(user, credential);

        return { message: "success" };
    } catch (error) {
        if (error.code === "auth/invalid-credential") {
            return { message: "incorrect" };
        } else {
            console.error("Error reauthenticating: ", error);
            return { message: "error" };
        }
    }
};

export const updateUserDetails = async (username, email, password) => {
    const user = auth.currentUser;

    try {
        if (username !== user.displayName) {
            await updateProfile(user, { displayName: username });
        }
        if (email !== user.email) {
            await updateEmail(user, email);
        }
        if (password !== "") {
            await updatePassword(user, password);
        }
        return { status: 200, message: "Successfully updated user details" };
    } catch (error) {
        console.error("Error updating user details: ", error);
        return { status: 500, message: "Error updating user details" };
    }
};

export const linkGoogleWithEmail = async (username, email, password) => {
    const user = auth.currentUser;
    try {
        if (user.displayName !== username)
            await updateProfile(user, { displayName: username });

        const credential = EmailAuthProvider.credential(email, password);
        await linkWithCredential(user, credential);

        return { status: 200, message: "Successfully updated user details" };
    } catch (error) {
        console.error("Error deleting user: ", error);
        return { status: 500, message: "Error updating user details" };
    }
};

export const deleteAccount = async () => {
    const user = auth.currentUser;
    try {
        await deleteUser(user);
        return { status: 200, message: "Successfully deleted user" };
    } catch (error) {
        console.error("Error deleting user: ", error);
        return { status: 500, message: "Error deleting user" };
    }
};

export const sendPasswordReset = async (email) => {
    const user = auth.currentUser;

    try {
        await sendPasswordResetEmail(auth, email);
        return { status: 200, message: "Successfully sent password reset email" };
    } catch (error) {
        console.error("Error sending password email: ", error);
        return { status: 500, message: error.code };
    }
};
