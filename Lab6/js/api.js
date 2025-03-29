/** Функция для формирования HTML из JSON-данных */
const renderApiData = (method, data) => {
    let html = `<h4>${method} Response</h4>`;
    if (typeof data === "object" && data !== null) {
        html += Object.entries(data)
            .map(([key, value]) => `<div class="stat">
          <span class="stat-key">${key}:</span>
          <span class="stat-value">${value}</span>
        </div>`)
            .join("");
    } else {
        html += `<p>${data}</p>`;
    }
    return html;
};

/** Функция отображения панели API */
const showApi = (api) => {
    const apiTitles = {
        fakestore: "FakeStore API", jsonplaceholder: "JSONPlaceholder API", dog: "Dog API",
    };
    const apiContainer = document.getElementById("api-container");
    apiContainer.innerHTML = `
    <div class="api-card">
      <h3>${apiTitles[api] || "API"}</h3>
      <div class="api-actions">
        ${["GET", "POST", "PUT", "PATCH", "DELETE"]
        .map((method) => `<button onclick="callApi('${api}', '${method}')">${method}</button>`)
        .join("")}
      </div>
      <div id="api-result">
        <p>Выберите метод для взаимодействия с API</p>
      </div>
    </div>
  `;
};

/** функция для вызова API */
const callApi = (api, method) => {
    const resultDiv = document.getElementById("api-result");
    resultDiv.innerHTML = `<p>Загрузка...</p>`;
    let url = "";
    const options = {method};

    if (api === "fakestore") {
        if (method === "GET") {
            url = "https://fakestoreapi.com/products/1";
        } else if (method === "POST") {
            url = "https://fakestoreapi.com/products";
            options.headers = {"Content-Type": "application/json"};
            options.body = JSON.stringify({title: "New Product", price: 29.99});
        } else if (method === "PUT") {
            url = "https://fakestoreapi.com/products/1";
            options.headers = {"Content-Type": "application/json"};
            options.body = JSON.stringify({title: "Updated Product", price: 39.99});
        } else if (method === "PATCH") {
            url = "https://fakestoreapi.com/products/1";
            options.headers = {"Content-Type": "application/json"};
            options.body = JSON.stringify({price: 19.99});
        } else if (method === "DELETE") {
            url = "https://fakestoreapi.com/products/1";
        }
    } else if (api === "jsonplaceholder") {
        if (method === "GET") {
            url = "https://jsonplaceholder.typicode.com/posts/1";
        } else if (method === "POST") {
            url = "https://jsonplaceholder.typicode.com/posts";
            options.headers = {"Content-Type": "application/json; charset=UTF-8"};
            options.body = JSON.stringify({title: "test_post", body: "bar", userId: 1});
        } else if (method === "PUT") {
            url = "https://jsonplaceholder.typicode.com/posts/1";
            options.headers = {"Content-Type": "application/json; charset=UTF-8"};
            options.body = JSON.stringify({id: 1, title: "test_put", body: "bar", userId: 1});
        } else if (method === "PATCH") {
            url = "https://jsonplaceholder.typicode.com/posts/1";
            options.headers = {"Content-Type": "application/json; charset=UTF-8"};
            options.body = JSON.stringify({title: "test_patch"});
        } else if (method === "DELETE") {
            url = "https://jsonplaceholder.typicode.com/posts/1";
        }
    } else if (api === "dog") {
        if (method !== "GET") {
            resultDiv.innerHTML = `<p>Только GET метод поддерживается для Dog API</p>`;
            return;
        }
        url = "https://dog.ceo/api/breeds/image/random";
    }

    fetch(url, options)
        .then((response) => {
            if (!response.ok) {
                return response.text().then((text) => {
                    throw new Error(`HTTP error ${response.status}: ${text}`);
                });
            }
            return response.json();
        })
        .then((data) => {
            if (api === "dog") {
                resultDiv.innerHTML = `<img src="${data.message}" alt="Dog Image" style="max-width:100%; border-radius:8px;">`;
            } else {
                resultDiv.innerHTML = renderApiData(method, data);
            }
        })
        .catch((error) => {
            resultDiv.innerHTML = `<p>Ошибка: ${error}</p>`;
        });
};
