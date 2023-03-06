// Define API key and playlist ID
const apiKey = "AIzaSyDiRqzcOWvgk5XTdtpi-tWq0CYLp_ZONZo";
const playlistId = "PL-nKWS2MEWvoSBGGuGSclXwpHzSERR6bK";

// Construct API endpoint URL with query parameters
const apiUrl = "https://www.googleapis.com/youtube/v3/playlistItems";
const queryParams = `?part=snippet&maxResults=10&playlistId=${playlistId}&key=${apiKey}`;

// Make API request to retrieve video data
fetch(apiUrl + queryParams)
  .then((response) => response.json())
  .then((data) => {
    // Process video data into an array of objects with relevant properties
    const videoArray = data.items
      .map((item) => {
        const feedTitle = item.snippet.title;
        const videoID = item.snippet.resourceId.videoId;
        if (
          feedTitle.toLowerCase() !== "private video" &&
          feedTitle.toLowerCase() !== "deleted video"
        ) {
          return {
            title: item.snippet.title,
            thumbnail: "https://img.youtube.com/vi/" + videoID + "/0.jpg",
            url: `https://www.youtube.com/embed/${videoID}`,
          };
        } else {
          return null;
        }
      })
      .filter((video) => video !== null);

    // Add video list items to the DOM and set click event listeners to switch main video
    const videoList = document.getElementById("video-list");
    videoArray.forEach((video, index) => {
      const isActive = index === 0 ? "active" : "";
      const videoElement = document.createElement("div");
      videoElement.innerHTML = `
          <div class="list ${isActive}">
            <img class="list-thumbnail" src="${video.thumbnail}" alt="${video.title}">
            <div class="list-title">${video.title}</div>
          </div>
        `;
      videoList.appendChild(videoElement);

      const listItem = videoElement.querySelector(".list");
      listItem.onclick = (event) => {
        event.preventDefault();
        videoList.querySelectorAll(".list").forEach((remove) => {
          remove.classList.remove("active");
        });
        listItem.classList.add("active");
        document.querySelector(".main-video-container .main-video").src =
          video.url;
        document.querySelector(
          ".main-video-container .main-vid-title"
        ).innerHTML = `<h4 class="main-vid-title">${video.title}</h4>`;
      };
    });

    // Set main video properties based on first video in array
    const firstVideo = videoArray[0];
    document.querySelector(".main-video-container .main-video").src =
      firstVideo.url;
    document.querySelector(
      ".main-video-container .main-vid-title"
    ).innerHTML = `<h4 class="main-vid-title">${firstVideo.title}</h4>`;
  })
  .catch((error) => {
    console.error(error);
  });
