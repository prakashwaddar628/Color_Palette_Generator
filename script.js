// how to implement the color palette generation logic
// this script generates a color palette based on user input
// steps
// 1. Get a random color from the user input
// 2. Generate a color palette based on the random color
// 3. Display the generated palette on the webpage
// 4. Implement functionality to save the palette

const generateBtn = document.getElementById("generate");
const saveBtn = document.getElementById("save");
const paletteContainer = document.getElementById("palette");
const savedPalettesContainer = document.getElementById("saved-palettes");
const themeToggle = document.getElementById("theme-toggle");

// Function to generate a random hex color
const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};

// Function to display a color palette
const displayPalette = (colors) => {
    paletteContainer.innerHTML = ''; // Clear previous palette
    colors.forEach(color => {
        const colorBox = document.createElement("div");
        colorBox.classList.add("color-box");
        colorBox.style.backgroundColor = color;

        const colorCode = document.createElement("div");
        colorCode.classList.add("color-code");
        colorCode.textContent = color;

        colorBox.appendChild(colorCode);
        paletteContainer.appendChild(colorBox);

        // Copy color code to clipboard on click
        colorBox.addEventListener("click", () => {
            navigator.clipboard.writeText(color)
                .then(() => {
                    const originalText = colorCode.textContent;
                    colorCode.textContent = "Copied!";
                    setTimeout(() => {
                        colorCode.textContent = originalText;
                    }, 800); // Briefly show "Copied!"
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                });
        });
    });
};

// Generate initial palette on page load
document.addEventListener("DOMContentLoaded", () => {
    generatePalette();
    loadSavedPalettes();
    // Set initial theme based on localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
        themeToggle.textContent = savedTheme === 'dark-mode' ? 'Light Mode' : 'Dark Mode';
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = 'Light Mode';
    } else {
        themeToggle.textContent = 'Dark Mode';
    }
});

// Function to generate and display a new palette
const generatePalette = () => {
    const colors = [];
    for (let i = 0; i < 5; i++) {
        colors.push(getRandomColor());
    }
    displayPalette(colors);
};

// Event listener for generating a new palette
generateBtn.addEventListener("click", generatePalette);

// Function to save the current palette to localStorage
saveBtn.addEventListener("click", () => {
    const currentColors = [];
    document.querySelectorAll("#palette .color-box").forEach(box => {
        currentColors.push(box.style.backgroundColor);
    });

    if (currentColors.length === 0) {
        alert("Generate a palette before saving!");
        return;
    }

    let savedPalettes = JSON.parse(localStorage.getItem("savedPalettes")) || [];
    // Check for duplicates before saving
    const isDuplicate = savedPalettes.some(palette => JSON.stringify(palette) === JSON.stringify(currentColors));

    if (isDuplicate) {
        alert("This palette is already saved!");
        return;
    }

    savedPalettes.push(currentColors);
    localStorage.setItem("savedPalettes", JSON.stringify(savedPalettes));
    loadSavedPalettes(); // Reload saved palettes display
    alert("Palette saved!");
});

// Function to load and display saved palettes
const loadSavedPalettes = () => {
    savedPalettesContainer.innerHTML = ''; // Clear previous saved palettes
    let savedPalettes = JSON.parse(localStorage.getItem("savedPalettes")) || [];

    if (savedPalettes.length === 0) {
        savedPalettesContainer.innerHTML = '<p>No saved palettes yet.</p>';
        return;
    }

    savedPalettes.forEach((palette, index) => {
        const paletteItem = document.createElement("div");
        paletteItem.classList.add("saved-palette-item");

        const paletteColorsDiv = document.createElement("div");
        paletteColorsDiv.classList.add("saved-palette-colors");
        palette.forEach(color => {
            const colorBox = document.createElement("div");
            colorBox.classList.add("saved-color-box");
            colorBox.style.backgroundColor = color;
            paletteColorsDiv.appendChild(colorBox);
        });
        paletteItem.appendChild(paletteColorsDiv);

        const actionsDiv = document.createElement("div");
        actionsDiv.classList.add("saved-palette-actions");

        const loadBtn = document.createElement("button");
        loadBtn.textContent = "Load";
        loadBtn.classList.add("load-palette-btn");
        loadBtn.addEventListener("click", () => {
            displayPalette(palette);
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top to see loaded palette
        });
        actionsDiv.appendChild(loadBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-palette-btn");
        deleteBtn.addEventListener("click", () => {
            deletePalette(index);
        });
        actionsDiv.appendChild(deleteBtn);

        paletteItem.appendChild(actionsDiv);
        savedPalettesContainer.appendChild(paletteItem);
    });
};

// Function to delete a saved palette
const deletePalette = (indexToDelete) => {
    let savedPalettes = JSON.parse(localStorage.getItem("savedPalettes")) || [];
    savedPalettes.splice(indexToDelete, 1); // Remove the palette at the given index
    localStorage.setItem("savedPalettes", JSON.stringify(savedPalettes));
    loadSavedPalettes(); // Reload the display
};

// Dark/Light Mode Toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    themeToggle.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('theme', isDarkMode ? 'dark-mode' : 'light-mode');
});