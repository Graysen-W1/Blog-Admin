const url = 'https://graysen-W1.github.io/Blog-Data/blog-entries.json';
let posts = [];

// This loads JSON data from server
// source: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
function loadDataFromServer() {
    fetch(url)
        .then(function(response) { return response.json(); })
        .then(function(result) {
            posts = result.devBlogEntries;
            show(posts);
        });
}

// source: https://www.w3schools.com/js/js_htmldom_html.asp
function show(list) {
    let html = '';
    for (let i = 0; i < list.length; i++) {
        const post = list[i];
        
        html += '<div class="card mb-3">';
        html += '<div class="card-header bg-primary text-white"><h5>' + post.title + '</h5></div>';
        html += '<div class="card-body">';
        html += '<p>' + post.text + '</p>';
        html += '<small class="text-muted">Date: ' + post.date + ' | Topic: ' + post.topic + ' | Author: ' + post.author + '</small>';
        
        if (post.tags && post.tags.length > 0) {
            html += '<div class="mt-2">';
            html += '<span class="badge bg-secondary me-1">' + post.tags.join('</span><span class="badge bg-secondary me-1">') + '</span>';
            html += '</div>';
        }

        html += '<div class="mt-3">';
        html += '<button class="btn btn-warning me-2" onclick="edit(' + i + ')">Edit</button>';
        html += '<button class="btn" style="background-color: purple; color: white;" onclick="remove(' + i + ')">Delete</button>';
        html += '</div></div></div>';
    }
    document.getElementById('dataContainer').innerHTML = html;
}

// Extra Credit: Search 
// source: https://www.w3schools.com/js/js_string_methods.asp
function searchPosts() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const filtered = [];
    
    for (const post of posts) {
        const allText = post.title + ' ' + post.text + ' ' + post.topic + ' ' + post.author;
        
        if (allText.toLowerCase().includes(term) || term === '') {
            filtered.push(post);
        }
    }
    show(filtered);
}

// Extra Credit: Sort
// source: https://www.w3schools.com/jsref/jsref_sort.asp
function sortPosts() {
    const by = document.getElementById('sortSelect').value;
    if (by === 'date-newest') {
        posts.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
    } else if (by === 'title-az') {
        posts.sort(function(a, b) { return a.title.localeCompare(b.title); });
    }
    show(posts);
}

function saveNewPost() {
    const get = function(id) { return document.getElementById(id).value || '...'; };
    const tags = get('postTags').split(',');
    
    posts.unshift({
        title: get('postTitle') || 'Untitled',
        topic: get('postTopic'),
        date: get('postDate'),
        text: get('postContent'),
        author: get('postAuthor'),
        tags: tags
    });
    
    show(posts);
    document.getElementById('addPostForm').reset();
    bootstrap.Modal.getInstance(document.getElementById('addPostModal')).hide();
    toast('New post added!');
}

// Editing and Deleting Posts
// source: https://www.w3schools.com/js/js_popup.asp
function edit(i) {
    const p = posts[i];
    const title = prompt('Title (if not, click okay):', p.title);
    const topic = prompt('Topic (if not, click okay):', p.topic);
    const date = prompt('Date (if not, click okay):', p.date);
    const text = prompt('Content (if not, click okay):', p.text);
    const author = prompt('Author (if not, click okay):', p.author);
    const tags = prompt('Tags (separate with commas, if not, click okay):', p.tags ? p.tags.join(', ') : '');
    
    if (title !== null) {
        posts[i].title = title || p.title;
        posts[i].topic = topic || p.topic;
        posts[i].date = date || p.date;
        posts[i].text = text || p.text;
        posts[i].author = author || p.author;
        posts[i].tags = tags ? tags.split(',') : p.tags;
        show(posts);
        toast('Post updated!');
    }
}

function remove(i) {
    if (confirm('Delete this post?')) {
        posts.splice(i, 1);
        show(posts);
        toast('Post deleted!');
    }
}

// Extra Credit: BS5 Toast
// source: https://getbootstrap.com/docs/5.0/components/toasts/
function toast(msg) {
    document.getElementById('toastMessage').textContent = msg;
    new bootstrap.Toast(document.getElementById('successToast')).show();
}

// source: https://www.w3schools.com/js/js_htmldom_events.asp
window.addEventListener('load', loadDataFromServer);

