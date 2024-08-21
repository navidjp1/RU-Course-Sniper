import { auth } from "./firebase";
import { updateProfile } from "firebase/auth";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    deleteUser,
} from "firebase/auth";
import { registerUser } from "../api/registerData";

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

        // await auth.signOut();

        return true;
    } catch (error) {
        console.error("Error signing up: ", error);
        return false;
    }
};

export const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
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
        return { message: "success" };
    } catch (error) {
        console.error("Error updating user details: ", error);
        return { message: "error" };
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
