export function createBody() {
    const main = document.createElement("main");

    // About section
    const about = document.createElement("section");
    about.id = "about";
    about.className = "section";
    const h1 = document.createElement("h1");
    h1.textContent = "Hallo, ich bin Max Mustermann";
    const p1 = document.createElement("p");
    p1.textContent = "Webentwickler mit Fokus auf Frontend und Animationen.";
    about.append(h1, p1);
    main.appendChild(about);

    // Projects section
    const projects = document.createElement("section");
    projects.id = "projects";
    projects.className = "section";
    const h2Projects = document.createElement("h2");
    h2Projects.textContent = "Meine Projekte";
    const projectList = document.createElement("div");
    projectList.id = "project-list";
    projects.append(h2Projects, projectList);
    main.appendChild(projects);

    // Contact section
    const contact = document.createElement("section");
    contact.id = "contact";
    contact.className = "section";
    const h2Contact = document.createElement("h2");
    h2Contact.textContent = "Kontakt";

    const form = document.createElement("form");
    form.id = "contact-form";

    const labelName = document.createElement("label");
    labelName.htmlFor = "name";
    labelName.textContent = "Name:";
    const inputName = document.createElement("input");
    inputName.type = "text";
    inputName.id = "name";
    inputName.required = true;

    const labelEmail = document.createElement("label");
    labelEmail.htmlFor = "email";
    labelEmail.textContent = "E-Mail:";
    const inputEmail = document.createElement("input");
    inputEmail.type = "email";
    inputEmail.id = "email";
    inputEmail.required = true;

    const labelMessage = document.createElement("label");
    labelMessage.htmlFor = "message";
    labelMessage.textContent = "Nachricht:";
    const textarea = document.createElement("textarea");
    textarea.id = "message";
    textarea.rows = 4;
    textarea.required = true;

    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = "Senden";

    const status = document.createElement("p");
    status.id = "form-status";

    form.append(labelName, inputName, labelEmail, inputEmail, labelMessage, textarea, button);
    contact.append(h2Contact, form, status);
    main.appendChild(contact);

    document.body.appendChild(main);
}
