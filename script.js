const calculateHours = (timestamp) => parseInt(timestamp / 3600);
const calculateMinutes = (timestamp) => parseInt((timestamp % 3600) / 60);

const setTabsDataInComponent = (data) => {
    const tabsContainer = document.getElementById("tabs");
    data.forEach((category) => {
        const a = document.createElement("a");
        a.classList.add("tab", "mx-[6px]", "px-[15px]", "py-[4px]", "rounded", "bg-gray-300", "text-black");
        a.addEventListener('click', () => {
            fetchAndDisplayCategory(category.category_id);
            document.querySelector('.tab-active')?.classList.remove('tab-active');
            document.querySelector('.bg-red-500')?.classList.remove('bg-red-500');
            a.classList.add('tab-active');
            a.classList.add('bg-red-500');
        });
        a.innerText = `${category.category}`;
        tabsContainer.appendChild(a);
    });
    const firstTab = document.querySelector(".tab");
    firstTab.classList.add("tab-active")
    firstTab.classList.add('bg-red-500');
}

const loadCards = (cards) => {
    const getCardsContainer = document.getElementById("card-container");
    const cardsSection = document.getElementById("card-section");
    cardsSection.innerHTML = "";
    getCardsContainer.textContent = "";
    if (cards.length !== 0) {
        cards.forEach((card) => {
            const div = document.createElement("div");
            div.classList.add("mb-6");
            div.innerHTML = `
            <div class="w-full">
                <div class="relative">
                    <img class="rounded-lg mb-5 w-[425.75px] h-[250px]" src=${card.thumbnail} alt="">
                    <p class="text-white text-xs absolute px-2 py-1 rounded right-20 md:right-5 bottom-5
                        ${card?.others?.posted_date ? " bg-black" : ""}">
                        ${card?.others?.posted_date ? `${calculateHours(card.others.posted_date)} hrs ${calculateMinutes(
                            card.others.posted_date
                        )} min ago` : ""}
                    </p>
                </div>
                <div class="flex">
                        <img class="rounded-full w-[40px] h-[40px] mr-3" src=${card?.authors[0]?.profile_picture} alt="">
                        <div>
                            <p class="text-base font-bold mb-[10px]">${card?.title}</p>
                            <p class="text-sm font-normal text-[#171717B2] mb-[10px] flex items-center">${card?.authors[0]?.profile_name}<span class="ml-1">${card?.authors[0]?.verified ? `<i class="fas fa-check-circle text-blue-500"></i>` : ""}</span></p>
                            <p class="text-sm font-normal text-[#171717B2] mb-[10px]">${card?.others?.views.slice(0, -1)}<span>K Views</span></p>
                        </div>
                </div>
            </div>
        `
            getCardsContainer.appendChild(div);
        })
    }
    else {
        cardsSection.innerHTML = `
            <img class="mt-20" src="./Icon.png" alt="">
            <p class="text-3xl font-semibold mt-10">Oops!! Sorry, There is no content here</p>
        `;
    }
}

const fetchCategoriesAndSetTabs = async () => {
    const url = 'https://openapi.programming-hero.com/api/videos/categories';
    const response = await fetch(url);
    const data = await response.json();
    setTabsDataInComponent(data.data);
}

const fetchAndDisplayCategory = async (categoryId) => {
    const url = `https://openapi.programming-hero.com/api/videos/category/${categoryId}`;
    const response = await fetch(url);
    const data = await response.json();
    loadCards(data.data);
    document.getElementById("sort-button").addEventListener("click", function () {
        const cardData = data.data;
        cardData.sort((a, b) => {
            return b?.others?.views.slice(0, -1) - a?.others?.views.slice(0, -1)
        })
        loadCards(cardData)
    })
}

fetchCategoriesAndSetTabs();
fetchAndDisplayCategory("1000")
