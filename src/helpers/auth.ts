import { apiBaseUrl } from "@/config";

export function startAuth(
  client: "link" | "login" = "login",
  idphint: string = "",
) {
  // Create and submit a form to post to the API login route.
  const form = document.createElement("form");
  form.method = "POST";
  form.action = `${apiBaseUrl}/auth/${client}`;
  form.style.display = "none";

  if (idphint) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "idphint";
    input.value = idphint;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}
