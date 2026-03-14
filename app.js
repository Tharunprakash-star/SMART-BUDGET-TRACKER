// App Controller (Global Scope)
(function() {
    const state = {
        fullName: "",
        selectedCity: null,
        salary: 0,
        familySize: 1,
        priorities: {},
        allocation: []
    };

    const pages = {
        p1: document.getElementById('page-1'),
        p2: document.getElementById('page-2'),
        p3: document.getElementById('page-3')
    };

    // --- Page 1 Logic ---
    const nameInput = document.getElementById('full-name');
    const citySearch = document.getElementById('city-search');
    const cityResults = document.getElementById('city-results');
    const detectionInfo = document.getElementById('detection-info');
    const btnContinue = document.getElementById('btn-continue');

    nameInput.addEventListener('input', (e) => {
        const val = e.target.value;
        const errorMsg = document.getElementById('name-error');
        if (!/^[a-zA-Z\s]*$/.test(val)) {
            errorMsg.textContent = "Only alphabets allowed";
        } else if (val.length < 3 && val.length > 0) {
            errorMsg.textContent = "Minimum 3 characters required";
        } else {
            errorMsg.textContent = "";
        }
    });

    citySearch.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        renderCityList(term);
    });

    // Show all cities on focus/click if empty
    citySearch.addEventListener('focus', () => {
        if (citySearch.value === "") {
            renderCityList("");
        }
    });

    function renderCityList(filter = "") {
        cityResults.innerHTML = '';
        const matches = citiesData.filter(c => 
            c.city.toLowerCase().includes(filter) || 
            c.country.toLowerCase().includes(filter)
        );

        if (matches.length > 0) {
            cityResults.style.display = 'block';
            matches.forEach(m => {
                const div = document.createElement('div');
                div.className = 'dropdown-item';
                div.innerHTML = `<strong>${m.city}</strong>, ${m.country}`;
                div.onclick = () => selectCity(m);
                cityResults.appendChild(div);
            });
        } else {
            cityResults.style.display = 'none';
        }
    }

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-container')) {
            cityResults.style.display = 'none';
        }
    });

    function selectCity(cityObj) {
        state.selectedCity = cityObj;
        citySearch.value = cityObj.city;
        cityResults.style.display = 'none';
        
        document.getElementById('detected-country').textContent = cityObj.country;
        document.getElementById('detected-currency').textContent = `${cityObj.symbol} (${cityObj.currency})`;
        detectionInfo.classList.remove('hidden');
        document.getElementById('city-error').textContent = "";
    }

    btnContinue.onclick = () => {
        const nameVal = nameInput.value.trim();
        const nameError = document.getElementById('name-error');
        const cityError = document.getElementById('city-error');
        
        let valid = true;
        if (nameVal.length < 3 || !/^[a-zA-Z\s]+$/.test(nameVal)) {
            nameError.textContent = "Valid name required (min 3 chars)";
            valid = false;
        }
        if (!state.selectedCity) {
            cityError.textContent = "Select a city from the list";
            valid = false;
        }

        if (valid) {
            state.fullName = nameVal;
            showPage('p2');
            initPage2();
        }
    };

    // --- Page 2 Logic ---
    function initPage2() {
        document.getElementById('welcome-msg').textContent = `Hello ${state.fullName} from ${state.selectedCity.city}`;
        document.querySelectorAll('.currency-label').forEach(el => el.textContent = `${state.selectedCity.currency} (${state.selectedCity.symbol})`);
        document.querySelectorAll('.currency-symbol').forEach(el => el.textContent = state.selectedCity.symbol);

        const domainsContainer = document.getElementById('domain-priorities');
        domainsContainer.innerHTML = '';

        const domains = [
            { key: "food", name: "Food & Groceries", icon: "🍽" },
            { key: "rent", name: "Rent / Housing", icon: "🏠" },
            { key: "utilities", name: "Utilities", icon: "💡" },
            { key: "transport", name: "Transportation", icon: "🚗" },
            { key: "medical", name: "Medical & Healthcare", icon: "🏥" },
            { key: "education", name: "Education", icon: "📚" },
            { key: "entertainment", name: "Entertainment", icon: "🎬" },
            { key: "insurance", name: "Insurance", icon: "🛡" },
            { key: "misc", name: "Miscellaneous", icon: "📦" }
        ];

        domains.forEach(d => {
            state.priorities[d.key] = 5;
            const div = document.createElement('div');
            div.className = 'priority-item';
            div.innerHTML = `
                <div class="domain-info">
                    <span>${d.icon} ${d.name}</span>
                    <span class="priority-val" id="val-${d.key}">5</span>
                </div>
                <input type="range" min="1" max="10" value="5" id="range-${d.key}">
            `;
            domainsContainer.appendChild(div);

            const range = div.querySelector('input');
            range.oninput = (e) => {
                const val = e.target.value;
                state.priorities[d.key] = parseInt(val);
                document.getElementById(`val-${d.key}`).textContent = val;
            };
        });
    }

    document.getElementById('btn-generate').onclick = () => {
        const salary = parseFloat(document.getElementById('monthly-salary').value);
        const family = parseInt(document.getElementById('family-size').value);

        if (!salary || salary <= 0) {
            alert("Please enter a valid salary");
            return;
        }
        
        state.salary = salary;
        state.familySize = family || 1;
        state.savingsTarget = parseFloat(document.getElementById('savings-target').value) || 15;
        state.allocation = window.calculateBudget(state.salary, state.familySize, state.priorities, state.savingsTarget);
        showPage('p3');
        renderResults();
    };

    document.getElementById('btn-back-1').onclick = () => showPage('p1');

    // --- Page 3 Logic ---
    let chartInstance = null;

    function renderResults() {
        const tbody = document.querySelector('#allocation-table tbody');
        tbody.innerHTML = '';
        state.allocation.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.icon} ${item.name}</td>
                <td>${state.selectedCity.symbol}${item.amount.toLocaleString()}</td>
                <td>${item.percentage}%</td>
                <td><div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${item.percentage}%"></div></div></td>
            `;
            tbody.appendChild(tr);
        });

        const ctx = document.getElementById('budgetChart').getContext('2d');
        if (chartInstance) chartInstance.destroy();
        chartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: state.allocation.map(a => a.name),
                datasets: [{
                    data: state.allocation.map(a => a.percentage),
                    backgroundColor: [
                        '#ff3838', '#ff9f1a', '#fff200', '#3ae374', '#18dcff', 
                        '#7d5fff', '#ff4dff', '#7efff5', '#ffaf40', '#4b4b4b'
                    ],
                    borderWidth: 0
                }]
            },
            options: { plugins: { legend: { position: 'bottom', labels: { color: '#fff' } } } }
        });

        const top2 = [...state.allocation].sort((a,b) => b.percentage - a.percentage).slice(0,2);
        const savings = state.allocation.find(a => a.key === "savings");
        
        document.getElementById('budget-summary').innerHTML = `
            <p style="margin-bottom: 15px;">
                Hello <strong>${state.fullName}</strong>, your personalized financial blueprint for <strong>${state.selectedCity.city}</strong> is ready. 
                With a monthly income of <strong>${state.selectedCity.symbol}${state.salary.toLocaleString()}</strong>, your strategy emphasizes 
                <strong>${top2[0].name}</strong> (${top2[0].percentage}%) and <strong>${top2[1].name}</strong> (${top2[1].percentage}%) as your primary expenditure areas.
            </p>
            <p>
                By strictly allocating <strong>${savings.percentage}%</strong> towards your <strong>Savings</strong>, you are building a robust financial future. 
                We've adjusted these categories based on your family size of <strong>${state.familySize}</strong> and your specific priorities to ensure a balanced lifestyle 
                without compromising on your long-term goals.
            </p>
        `;

        const warnings = window.getWarnings(state.allocation, state.salary);
        const wCont = document.getElementById('warnings-container');
        wCont.innerHTML = '';
        warnings.forEach(w => { const p = document.createElement('p'); p.className = 'warning-item'; p.textContent = w; wCont.appendChild(p); });

        const savingsObj = state.allocation.find(a => a.key === "savings");
        const suggestions = window.getInvestmentSuggestions(savingsObj.amount, state.salary, state.allocation);
        const list = document.getElementById('investment-list');
        list.innerHTML = '';
        suggestions.forEach(s => { const li = document.createElement('li'); li.textContent = s; list.appendChild(li); });
    }

    document.getElementById('btn-restart').onclick = () => window.location.reload();
    document.getElementById('btn-back-2').onclick = () => showPage('p2');
    document.getElementById('btn-print').onclick = async () => {
        const { jsPDF } = window.jspdf;
        const canvas = await html2canvas(document.getElementById('app'), { scale: 2 });
        const img = canvas.toDataURL('image/png');
        const doc = new jsPDF('p', 'mm', 'a4');
        doc.addImage(img, 'PNG', 0, 10, 210, (canvas.height * 210) / canvas.width);
        doc.save(`Budget_${state.fullName}.pdf`);
    };

    function showPage(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        pages[pageId].classList.add('active');
        window.scrollTo(0,0);
    }
})();
