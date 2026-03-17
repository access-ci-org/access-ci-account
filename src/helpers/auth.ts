import { apiBaseUrl  } from "@/config";

// startLogin - Create and submit a form to post to the API login route.
export function startLogin(params?: Record<string, string>) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = `${apiBaseUrl}/auth/login`;
    form.style.display = "none";

    // Add params as hidden inputs, these key value pairs are POST as form data to /auth/login
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        const input = document.createElement("input"); 
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });
    }

    document.body.appendChild(form);
    form.submit();
}