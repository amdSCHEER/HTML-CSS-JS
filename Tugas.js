const page = document.querySelector(".page");
const mainContent = page?.querySelector(".content");

if (mainContent) {
	const formStyles = document.createElement("style");
	formStyles.textContent = `
		body { background: #f1f4ef; color: #26332d; }
	.page { max-width: 900px; padding-top: 42px; }
	.content { margin-top: 0; }
	#formulir-pilihan {
		max-width: 760px;
		margin: 38px auto 0;
		padding: 30px;
		border: 1px solid #dce4dc;
		border-radius: 10px;
		box-shadow: 0 8px 24px #26332d12;
		transition: none;
	}
	#formulir-pilihan:hover { transform: none; }
	#formulir-pilihan h3 {
		margin-bottom: 6px;
		color: #26332d;
		font-family: Georgia, serif;
		font-size: 29px;
		font-weight: 500;
	}
	.form-intro { margin-bottom: 22px; color: #68766d; }
	.form-grid, .choices-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 18px;
		align-items: start;
	}
	.form-field { display: grid; align-content: start; gap: 7px; margin: 0 0 18px; }
	.form-field > label, .choice-group legend { font-size: 14px; font-weight: 700; }
	.form-field input, .form-field select {
		width: 100%;
		min-height: 42px;
		padding: 9px 11px;
		border: 1px solid #cbd5cd;
		border-radius: 5px;
		background: #fff;
		color: inherit;
		font: inherit;
	}
	.form-field input:focus, .form-field select:focus {
		outline: 2px solid #5c8068;
		outline-offset: 1px;
	}
	.quantity-controls { display: flex; gap: 10px; }
	.quantity-controls input { max-width: 130px; }
	.form-button {
		min-height: 42px;
		padding: 9px 15px;
		border: 0;
		border-radius: 5px;
		background: #315e49;
		color: #fff;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	.form-button:hover { background: #244a38; }
	.form-button-light { border: 1px solid #cbd5cd; background: #f7f9f6; color: #26332d; }
	.form-button-light:hover { background: #e8eee9; }
	.choice-group { min-width: 0; margin: 0 0 20px; padding: 14px; border: 1px solid #dce4dc; border-radius: 6px; }
	.choice-group legend { padding: 0 5px; }
	.choice-group legend span { color: #718078; font-size: 12px; font-weight: 400; }
	.choice-options { display: grid; gap: 8px; }
	.choice-option { display: flex; align-items: center; gap: 8px; color: #435149; font-size: 14px; }
	.choice-option input { accent-color: #315e49; }
	.form-submit { margin-top: 2px; }
	#formResult {
		margin-top: 20px;
		padding: 0 16px;
		border-left: 3px solid #a04d32;
		background: #f7f8f5;
	}
	#formResult:empty { display: none; }
	#formResult h3 { padding-top: 14px; font-family: Georgia, serif; font-size: 21px; }
	#formResult p { margin-bottom: 8px; }
	@media (max-width: 600px) {
		.page { width: 94%; padding-top: 24px; }
		#formulir-pilihan { padding: 20px; }
		.form-grid, .choices-grid { grid-template-columns: 1fr; gap: 0; }
		.quantity-controls { align-items: stretch; }
	}
	`;
	document.head.append(formStyles);

	const formSection = document.createElement("section");
	formSection.className = "table-card form-card";
	formSection.id = "formulir-pilihan";
	formSection.innerHTML = `
		<h3>Formulir Pilihan</h3>
		<p class="form-intro">Lengkapi data diri, lalu tentukan pilihanmu.</p>
		<form id="choiceForm" novalidate>
			<div class="form-grid">
				<div class="form-field">
					<label for="nameInput">Nama</label>
					<input type="text" id="nameInput" placeholder="Masukkan nama" required>
				</div>
				<div class="form-field">
					<label for="emailInput">Email</label>
					<input type="email" id="emailInput" placeholder="nama@email.com" required>
				</div>
			</div>
			<div class="form-field">
				<label for="optionCount">Jumlah pilihan <span>(1-10)</span></label>
				<div class="quantity-controls">
					<input type="number" id="optionCount" min="1" max="10" step="1" value="3">
					<button type="button" id="makeOptions" class="form-button form-button-light">Buat pilihan</button>
				</div>
			</div>
			<div class="choices-grid">
				<div class="form-field">
					<label for="dropdownChoice">Dropdown</label>
					<select id="dropdownChoice"></select>
				</div>
				<fieldset class="choice-group">
					<legend>Checkbox <span>(boleh pilih beberapa)</span></legend>
					<div id="checkboxChoices" class="choice-options"></div>
				</fieldset>
				<fieldset class="choice-group">
					<legend>Radio button <span>(pilih satu)</span></legend>
					<div id="radioChoices" class="choice-options"></div>
				</fieldset>
			</div>
			<button type="submit" class="form-button form-submit">Tampilkan hasil</button>
		</form>
		<div id="formResult" aria-live="polite"></div>
	`;
	mainContent.append(formSection);

	const choiceForm = document.getElementById("choiceForm");
	const optionCount = document.getElementById("optionCount");
	const dropdownChoice = document.getElementById("dropdownChoice");
	const checkboxChoices = document.getElementById("checkboxChoices");
	const radioChoices = document.getElementById("radioChoices");
	const formResult = document.getElementById("formResult");

	function makeOptions() {
		const count = Number(optionCount.value);

		if (!Number.isInteger(count) || count < 1 || count > 10) {
			alert("Jumlah pilihan harus berupa angka bulat dari 1 sampai 10.");
			optionCount.focus();
			return;
		}

		const checkboxOptions = [];
		const radioOptions = [];
		dropdownChoice.replaceChildren();
		checkboxChoices.replaceChildren();
		radioChoices.replaceChildren();

		for (let i = 1; i <= count; i++) {
			checkboxOptions.push(`Pilihan ${i}`);
			radioOptions.push(`Pilihan ${i}`);
		}

		checkboxOptions.forEach((text, index) => {
			const dropdownOption = document.createElement("option");
			dropdownOption.value = text;
			dropdownOption.textContent = text;
			dropdownChoice.append(dropdownOption);

			const checkboxLabel = document.createElement("label");
			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.name = "checkboxChoice";
			checkbox.value = text;
			checkbox.id = `check-${index}`;
			checkboxLabel.htmlFor = checkbox.id;
			checkboxLabel.className = "choice-option";
			checkboxLabel.append(checkbox, document.createTextNode(text));
			checkboxChoices.append(checkboxLabel);
		});

		radioOptions.forEach((text, index) => {
			const radioLabel = document.createElement("label");
			const radio = document.createElement("input");
			radio.type = "radio";
			radio.name = "radioChoice";
			radio.value = text;
			radio.required = index === 0;
			radio.id = `radio-${index}`;
			radioLabel.htmlFor = radio.id;
			radioLabel.className = "choice-option";
			radioLabel.append(radio, document.createTextNode(text));
			radioChoices.append(radioLabel);
		});

		formResult.replaceChildren();
	}

	document.getElementById("makeOptions").addEventListener("click", makeOptions);

	choiceForm.addEventListener("submit", (event) => {
		event.preventDefault();

		const name = document.getElementById("nameInput");
		const email = document.getElementById("emailInput");
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!name.value.trim()) {
			alert("Nama harus diisi.");
			name.focus();
			return;
		}

		if (!emailPattern.test(email.value.trim())) {
			alert("Format email salah. Silakan masukkan ulang.");
			email.focus();
			email.select();
			return;
		}

		const checked = Array.from(
			choiceForm.querySelectorAll('input[name="checkboxChoice"]:checked'),
			(input) => input.value
		);
		const selectedRadio = choiceForm.querySelector('input[name="radioChoice"]:checked');

		if (!selectedRadio) {
			alert("Silakan pilih salah satu radio button.");
			return;
		}

		const results = [
			`Nama: ${name.value.trim()}`,
			`Email: ${email.value.trim()}`,
			`Dropdown: ${dropdownChoice.value}`,
			`Checkbox: ${checked.length ? checked.join(", ") : "Tidak ada"}`,
			`Radio button: ${selectedRadio.value}`
		];

		formResult.replaceChildren();
		const heading = document.createElement("h3");
		heading.textContent = "Hasil pilihan";
		formResult.append(heading);

		results.forEach((text) => {
			const paragraph = document.createElement("p");
			paragraph.textContent = text;
			formResult.append(paragraph);
		});
	});

	makeOptions();
}
