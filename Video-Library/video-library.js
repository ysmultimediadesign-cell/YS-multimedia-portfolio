document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
       VIDEO LIBRARY DATA
       =========================================================

       Each category has:

       title
       description
       videos[]

       To add a video, put the video inside:

       assets/videos/

       Then add its filename below.

       ========================================================= */

  const videoData = {
    "lagn-patrika": { title: "Lagn Patrika Videos", description: "Lagn Patrika videography.", videos: [] },
    "digital-lagn-patrika": { title: "Digital Lagn Patrika Videos", description: "Digital Lagn Patrika videos.", videos: [] },
    engagement: { title: "Engagement Videos", description: "Engagement ceremony videography.", videos: [] },
    grahdev: { title: "Gaondev Videos", description: "Gaondev ceremony videography.", videos: [] },
    "ghana-bangdya": { title: "Ghana Bangdya Videos", description: "Ghana Bangdya ceremony videography.", videos: [] },
    kelvan: { title: "Kelvan Videos", description: "Kelvan ceremony videography.", videos: [] },
    mehendi: { title: "Mehendi Videos", description: "Mehendi ceremony videography.", videos: [] },
    haldi: { title: "Haldi Videos", description: "Haldi ceremony videography.", videos: [] },
    wedding: { title: "Wedding Day Videos", description: "Wedding day videography.", videos: [] },
    gruhpravesh: { title: "Gruhpravesh Videos", description: "Gruhpravesh ceremony videography.", videos: [] },
    reception: { title: "Reception Videos", description: "Wedding reception videography.", videos: [] },
    "pre-wedding": { title: "Pre Wedding Videos", description: "Pre wedding films.", videos: [] },
    "couple-videos": { title: "Couple Videos", description: "Creative couple videos.", videos: [] },
    "save-the-date": { title: "Save The Date Videos", description: "Save The Date videos.", videos: [] },
    birthday: { title: "Birthday Videos", description: "Birthday event videography.", videos: [] },
    anniversary: { title: "Anniversary Videos", description: "Anniversary event videography.", videos: [] },
    "baby-welcome": { title: "Baby Welcome Videos", description: "Baby welcome event videography.", videos: [] },
    "namkaran-barse": { title: "Namkaran ( Barse ) Videos", description: "Namkaran (Barse) ceremony videography.", videos: [] },
    "shop-opening": { title: "Shop Opening Videos", description: "Shop opening event videography.", videos: [] },
    "new-car-delivery": { title: "Car Delivery Videos", description: "New car delivery event videography.", videos: [] },
    vatpournima: { title: "Vatpournima Videos", description: "Vatpournima event videography.", videos: [] },
    "new-home": { title: "New Home Videos", description: "New home event videography.", videos: [] },
    "baby-shoot": { title: "Baby Shoot", description: "Baby photography and videography highlights.", videos: [] },
    "model-shoot": { title: "Model Shoot", description: "Model portfolio and fashion shoot highlights.", videos: [] },
  };

  /* =========================================================
       GET TOPIC FROM URL
       ========================================================= */

  const params = new URLSearchParams(window.location.search);

  const topic = params.get("topic");

  /* =========================================================
       PAGE ELEMENTS
       ========================================================= */

  const titleElement = document.getElementById("library-title");

  const descriptionElement = document.getElementById("library-description");

  const library = document.getElementById("video-library");

  const emptyLibrary = document.getElementById("empty-library");

  /* =========================================================
       CHECK ELEMENTS
       ========================================================= */

  if (!titleElement || !descriptionElement || !library || !emptyLibrary) {
    console.error("Video library elements are missing.");

    return;
  }

  /* =========================================================
       INVALID / UNKNOWN TOPIC
       ========================================================= */

  if (!topic || !videoData[topic]) {
    titleElement.textContent = "Video Library";

    descriptionElement.textContent =
      "Select a category from our videography portfolio.";

    emptyLibrary.classList.add("show");

    return;
  }

  /* =========================================================
       LOAD SELECTED CATEGORY
       ========================================================= */

  const category = videoData[topic];

  titleElement.textContent = category.title;

  descriptionElement.textContent = category.description;

  const showEmptyState = (heading, message) => {
    emptyLibrary.querySelector("h2").textContent = heading;
    emptyLibrary.querySelector("p").textContent = message;
    emptyLibrary.classList.add("show");
  };

  const renderVideos = (videos) => {
    library.replaceChildren();
    if (!videos.length) {
      showEmptyState("No Videos Yet", "Videos for this category will be added here soon.");
      return;
    }

    emptyLibrary.classList.remove("show");
    videos.forEach((video, index) => {
      const card = document.createElement("article");
      card.className = "library-card";

      const wrapper = document.createElement("div");
      wrapper.className = "library-video-wrapper";
      const player = document.createElement("video");
      player.className = "library-video";
      player.src = video.src;
      player.controls = true;
      player.playsInline = true;
      player.preload = "metadata";
      player.setAttribute("controlsList", "nodownload");
      wrapper.append(player);

      const info = document.createElement("div");
      info.className = "library-card-info";
      const number = document.createElement("span");
      number.className = "library-card-number";
      number.textContent = String(index + 1).padStart(2, "0");
      const title = document.createElement("h2");
      title.className = "library-card-title";
      title.textContent = video.title;
      const description = document.createElement("p");
      description.className = "library-card-description";
      description.textContent = video.description || "";
      info.append(number, title, description);
      card.append(wrapper, info);
      library.append(card);
    });

    const allVideos = library.querySelectorAll("video");
    allVideos.forEach((video) => {
      video.addEventListener("play", () => {
        allVideos.forEach((otherVideo) => {
          if (otherVideo !== video && !otherVideo.paused) otherVideo.pause();
        });
      });
    });
  };

  const client = window.portfolioSupabase;
  if (!client) {
    if (category.videos.length) {
      renderVideos(category.videos);
    } else {
      showEmptyState(
        "Library Not Connected",
        "The portfolio admin has not been connected to Supabase yet.",
      );
    }
    return;
  }

  showEmptyState("Loading Videos", "Please wait while this category loads.");
  client
    .from("portfolio_items")
    .select("title, description, object_path")
    .eq("media_type", "video")
    .eq("category", topic)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .then(async ({ data, error }) => {
      if (error) throw error;
      const results = await Promise.all(data.map(async (item) => {
        const { data: signedFile, error: signedUrlError } = await client.storage
          .from("portfolio-media")
          .createSignedUrl(item.object_path, 60 * 60 * 24);
        if (signedUrlError) return { error: signedUrlError, item };
        return { video: {
          src: signedFile.signedUrl,
          title: item.title,
          description: item.description,
        } };
      }));
      const videos = results.filter((result) => result.video).map((result) => result.video);
      const failures = results.filter((result) => result.error);
      failures.forEach(({ item, error: signedUrlError }) => {
        console.error(`Could not load portfolio video "${item.title}":`, signedUrlError);
      });
      renderVideos(videos);
      if (!videos.length && failures.length) {
        showEmptyState(
          "Videos Temporarily Unavailable",
          "Some portfolio videos could not be loaded. Please try again later.",
        );
      }
    })
    .catch((error) => {
      console.error("Could not load portfolio videos:", error);
      // Never expose Supabase paths, bucket names, or raw backend errors to customers.
      showEmptyState(
        "Videos Temporarily Unavailable",
        "Please try again later. Our team has been notified.",
      );
    });
});
