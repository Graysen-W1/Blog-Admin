const blogDataURL = 'https://graysen-W1.github.io/Blog-Data/blog-entries.json';
let blogPosts = [];

// This loads JSON data from server
// Source: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
function loadDataFromServer() {
    fetch(blogDataURL)
        .then(function(response) { return response.json(); })
        .then(function(result) {
            blogPosts = result.devBlogEntries;
            displayBlogPosts();
        });
}

// Reference: https://www.w3schools.com/js/js_htmldom_html.asp
function displayBlogPosts() {
    const container = document.getElementById('dataContainer');
    let html = '';
    
    for (let i = 0; i < blogPosts.length; i++) {
        const post = blogPosts[i];
        html += '<div class="card mb-3"><div class="card-header bg-primary text-white"><h5>' + post.title + '</h5></div><div class="card-body"><p>' + post.text + '</p><small class="text-muted">Date: ' + post.date + ' | Topic: ' + post.topic + ' | Author: ' + post.author + '</small>';
        
        if (post.tags && post.tags.length > 0) {
            html += '<div class="mt-2">';
            for (let j = 0; j < post.tags.length; j++) {
                html += '<span class="badge bg-secondary me-1">' + post.tags[j] + '</span>';
            }
            html += '</div>';
        }
        html += '<div class="mt-3"><button class="btn btn-warning me-2" onclick="editPost(' + i + ')">Edit</button><button class="btn" style="background-color: purple; color: white;" onclick="deletePost(' + i + ')">Delete</button></div></div></div>';
    }
    container.innerHTML = html;
}

// Extra Credit: Search 
// Reference: https://www.w3schools.com/js/js_string_methods.asp
function searchPosts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const container = document.getElementById('dataContainer');
    let html = '';
    
    for (let i = 0; i < blogPosts.length; i++) {
        const post = blogPosts[i];
        const searchText = (post.title + ' ' + post.text + ' ' + post.topic + ' ' + post.author).toLowerCase();
        
        if (searchText.indexOf(searchTerm) !== -1 || searchTerm === '') {
            html += '<div class="card mb-3"><div class="card-header bg-primary text-white"><h5>' + post.title + '</h5></div><div class="card-body"><p>' + post.text + '</p><small class="text-muted">Date: ' + post.date + ' | Topic: ' + post.topic + ' | Author: ' + post.author + '</small>';
            
            if (post.tags && post.tags.length > 0) {
                html += '<div class="mt-2">';
                for (let j = 0; j < post.tags.length; j++) {
                    html += '<span class="badge bg-secondary me-1">' + post.tags[j] + '</span>';
                }
                html += '</div>';
            }
            html += '<div class="mt-3"><button class="btn btn-warning me-2" onclick="editPost(' + i + ')">Edit</button><button class="btn" style="background-color: purple; color: white;" onclick="deletePost(' + i + ')">Delete</button></div></div></div>';
        }
    }
    container.innerHTML = html;
}

// Extra Credit: Sort
// Reference: https://www.w3schools.com/jsref/jsref_sort.asp
function sortPosts() {
    const sortBy = document.getElementById('sortSelect').value;
    if (sortBy === 'date-newest') {
        blogPosts.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
    } else if (sortBy === 'title-az') {
        blogPosts.sort(function(a, b) { return a.title.localeCompare(b.title); });
    }
    displayBlogPosts();
}

function saveNewPost() {
    const title = document.getElementById('postTitle').value || 'Untitled';
    const topic = document.getElementById('postTopic').value || '...';
    const date = document.getElementById('postDate').value || '...';
    const text = document.getElementById('postContent').value || '...';
    const author = document.getElementById('postAuthor').value || '...';
    const tagsInput = document.getElementById('postTags').value || '';
    
    const tags = tagsInput ? tagsInput.split(',').map(function(tag) { return tag.trim(); }) : [];
    
    blogPosts.unshift({
        title: title,
        topic: topic,
        date: date,
        text: text,
        author: author,
        tags: tags
    });
    
    displayBlogPosts();
    document.getElementById('addPostForm').reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('addPostModal'));
    modal.hide();
    showToast('New post "' + title + '" has been added successfully!');
}

// Editing and Deleting Posts
function editPost(index) {
    const post = blogPosts[index];
    const newTitle = prompt('Title (if not, click okay):', post.title);
    const newTopic = prompt('Topic (if not, click okay):', post.topic);
    const newDate = prompt('Date (if not, click okay):', post.date);
    const newText = prompt('Content (if not, click okay):', post.text);
    const newAuthor = prompt('Author (if not, click okay):', post.author);
    const newTags = prompt('Tags (separate with commas, if not, click okay):', post.tags ? post.tags.join(', ') : '');
    
    if (newTitle !== null) {
        const originalTitle = post.title;
        blogPosts[index].title = newTitle || post.title;
        blogPosts[index].topic = newTopic || post.topic;
        blogPosts[index].date = newDate || post.date;
        blogPosts[index].text = newText || post.text;
        blogPosts[index].author = newAuthor || post.author;
        blogPosts[index].tags = newTags ? newTags.split(',').map(function(tag) { return tag.trim(); }) : post.tags;
        displayBlogPosts();
        showToast('Post "' + originalTitle + '" has been updated successfully!');
    }
}

function deletePost(index) {
    if (confirm('Are you sure you want to delete this post?')) {
        const deletedTitle = blogPosts[index].title;
        blogPosts.splice(index, 1);
        displayBlogPosts();
        showToast('Post "' + deletedTitle + '" has been deleted successfully!');
    }
}

// Extra Credit: BS5 Toast
// Source: https://getbootstrap.com/docs/5.0/components/toasts/
function showToast(message) {
    const toastElement = document.getElementById('successToast');
    document.getElementById('toastMessage').textContent = message;
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

// Reference: https://www.w3schools.com/js/js_htmldom_events.asp
window.addEventListener('load', function() {
    loadDataFromServer();
});

