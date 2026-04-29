import supabase from '../config/supabaseClient';

export async function signIn(identifier: string, password: string) {
    try {
        let email = identifier;

        // If identifier doesn't have an '@', assume it's a username
        if (!identifier.includes('@')) {
            const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
            
            if (listError) throw listError;

            // Find the user whose username in user_metadata matches the identifier
            const user = users.find(u => u.user_metadata?.username === identifier);
            
            if (!user || !user.email) {
                throw new Error("Invalid username or password.");
            }
            
            email = user.email;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        return {
            token: data.session.access_token,
            user: data.user
        };
    } catch (error: any) {
        console.error("Authentication failed:", error.message);
        throw error;
    }
}

export default signIn;

export async function signUp(email: string, password: string, username: string) {
    try {
        // Use the Admin API because we are on a secure backend using the Service Key
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            user_metadata: {
                username: username,
            },
            email_confirm: true // This auto-verifies the email so they can log in immediately
        });

        if (error) throw error;

        return data;
    } catch (error: any) {
        console.log("Registration failed.", error.message);
        throw error;
    }
}