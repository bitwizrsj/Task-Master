document.addEventListener('DOMContentLoaded', () => {
    const showFormButton = document.getElementById('showForm');
    const addProjectsContainer = document.getElementById('AddProjects');
    const editProjectContainer = document.getElementById('editProject');
    const projectDetailsContainer = document.getElementById('projectDetails');
    const saveProjectButton = document.getElementById('saveProject');
    const updateProjectButton = document.getElementById('updateProject');
    const projectsList = document.getElementById('projectsList');
    const filterNavLinks = document.querySelectorAll('.nav-link'); // Filter nav links
    let projects = JSON.parse(localStorage.getItem('projects')) || [];
    let currentEditIndex = null;
    let currentFilter = 'all';
  
    showFormButton.addEventListener('click', () => {
      addProjectsContainer.style.display = 'block';
      editProjectContainer.style.display = 'none';
      projectDetailsContainer.style.display = 'none';
    });
  
    saveProjectButton.addEventListener('click', async () => {
      const name = document.getElementById('projectName').value;
      const type = document.getElementById('projectType').value;
      const status = document.getElementById('projectStatus').value;
      const endDate = document.getElementById('projectEndDate').value;
      const summary = document.getElementById('projectSummaryText').value;
      const details = document.getElementById('projectDetailsText').value;
      const logoFile = document.getElementById('projectLogoImg').files[0];
      const imageFiles = document.getElementById('projectImgVid').files;
      const technologies = document.getElementById('projectTechnologies').value;
  
      const logo = logoFile ? await toBase64(logoFile) : '';
      const images = await Promise.all(Array.from(imageFiles).map(file => toBase64(file)));
  
      const project = {
        name,
        type,
        status,
        endDate,
        summary,
        details,
        logo,
        images,
        technologies
      };
  
      projects.push(project);
      localStorage.setItem('projects', JSON.stringify(projects));
      addProjectsContainer.style.display = 'none';
      renderProjects();
    });
  
    updateProjectButton.addEventListener('click', async () => {
      const project = await getProjectData(true);
      projects[currentEditIndex] = project;
      localStorage.setItem('projects', JSON.stringify(projects));
      editProjectContainer.style.display = 'none';
      renderProjects();
    });
  
    async function getProjectData(isEdit = false) {
      const prefix = isEdit ? 'edit' : '';
      const name = document.getElementById(`${prefix}ProjectName`).value;
      const type = document.getElementById(`${prefix}ProjectType`).value;
      const endDate = document.getElementById(`${prefix}ProjectEndDate`).value;
      const status = document.getElementById(`${prefix}ProjectStatus`).value;
      const summary = document.getElementById(`${prefix}ProjectSummaryText`).value;
      const details = document.getElementById(`${prefix}ProjectDetailsText`).value;
      const technologies = document.getElementById(`${prefix}ProjectTechnologies`).value;
      const logoFile = document.getElementById(`${prefix}ProjectLogoImg`).files[0];
      const imageFiles = document.getElementById(`${prefix}ProjectImgVid`).files;
  
      const logo = logoFile ? await toBase64(logoFile) : '';
      const images = await Promise.all(Array.from(imageFiles).map(file => toBase64(file)));
  
      return { name, type, endDate, status, summary, details, technologies, logo, images };
    }
  
    function renderProjects(filter = currentFilter) {
      projectsList.innerHTML = '';
      const filteredProjects = filter === 'all' ? projects : projects.filter(project => project.status === filter);
      filteredProjects.forEach((project, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${project.name}</td>
          <td>${project.type}</td>
          <td>${project.status}</td>
          <td>${project.endDate}</td>
          <td>
            <i class="fas fa-eye view-icon" data-index="${index}"></i>
            <i class="fas fa-edit edit-icon" data-index="${index}"></i>
            <i class="fas fa-trash-alt delete-icon" data-index="${index}"></i>
          </td>
        `;
        projectsList.appendChild(row);
      });
  
      attachIconListeners();
    }
  
    function attachIconListeners() {
      document.querySelectorAll('.view-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
          const index = e.target.getAttribute('data-index');
          viewProject(index);
        });
      });
  
      document.querySelectorAll('.edit-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
          const index = e.target.getAttribute('data-index');
          editProject(index);
        });
      });
  
      document.querySelectorAll('.delete-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
          const index = e.target.getAttribute('data-index');
          deleteProject(index);
        });
      });
    }
  
    function viewProject(index) {
      const project = projects[index];
      projectDetailsContainer.style.display = 'block';
      editProjectContainer.style.display = 'none';
      addProjectsContainer.style.display = 'none';
  
      document.getElementById('detailProjectLogo').src = project.logo;
      document.getElementById('detailProjectName').innerText = project.name;
      document.getElementById('detailProjectType').innerText = project.type;
      document.getElementById('detailProjectStatus').innerText = project.status;
      document.getElementById('detailProjectEndDate').innerText = project.endDate;
      document.getElementById('detailProjectSummary').innerText = project.summary;
      document.getElementById('detailProjectDetails').innerText = project.details;
      document.getElementById('detailProjectTechnologies').innerText = project.technologies;
  
      const imagesContainer = document.getElementById('detailProjectImages');
      imagesContainer.innerHTML = '';
      if (project.images) {
        project.images.forEach(image => {
          const img = document.createElement('img');
          img.src = image;
          img.style.width = '100px';
          img.style.marginRight = '10px';
          imagesContainer.appendChild(img);
        });
      }
    }
  
    function editProject(index) {
      currentEditIndex = index;
      const project = projects[index];
      editProjectContainer.style.display = 'block';
      addProjectsContainer.style.display = 'none';
      projectDetailsContainer.style.display = 'none';
  
      document.getElementById('editProjectName').value = project.name;
      document.getElementById('editProjectType').value = project.type;
      document.getElementById('editProjectEndDate').value = project.endDate;
      document.getElementById('editProjectStatus').value = project.status;
      document.getElementById('editProjectSummaryText').value = project.summary;
      document.getElementById('editProjectDetailsText').value = project.details;
      document.getElementById('editProjectTechnologies').value = project.technologies;
    }
  
    function deleteProject(index) {
      if (confirm('Are you sure you want to delete this project?')) {
        projects.splice(index, 1);
        localStorage.setItem('projects', JSON.stringify(projects));
        renderProjects(); // Update the table after deletion
      }
    }
  
    // Filter projects based on nav link click
    filterNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = e.target.getAttribute('data-filter');
        currentFilter = filter;
        document.querySelectorAll('.nav-link').forEach(navLink => {
          navLink.classList.remove('active');
        });
        e.target.classList.add('active');
        renderProjects(filter);
      });
    });
  
    // Convert a file to a base64 string
    function toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });
    }
  
    // Initial rendering of projects when the page loads
    renderProjects();
  });
  