// src/pages/Forum.jsx
import { useState, useEffect } from "react";
import { Plus, MessageCircle, Eye, Heart, ThumbsDown, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from '../components/Sidebar';


const tags = [
    { name: "#javascript", count: 120 },
    // { name: "#react", count: 98 },
    // { name: "#blockchain", count: 87 },
    // { name: "#uiux", count: 75 },
    // { name: "#design", count: 60 },
    // { name: "#opensource", count: 45 },
];

function CommentSection({ postId, user }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [showComments, setShowComments] = useState(false);
    const [commentCount, setCommentCount] = useState(0);

    // Load comment count immediately
    useEffect(() => {
        fetch(`http://localhost:8080/post/${postId}`)
            .then(res => res.json())
            .then(data => {
                setCommentCount(data.comments?.length || 0);
                if (showComments) {
                    setComments(data.comments || []);
                }
            });
    }, [postId, showComments]);

    const handleAdd = async (e) => {
        e.preventDefault();
        await fetch('http://localhost:8080/add_comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                post_id: postId,
                user_id: user.id,
                username: user.user_metadata.full_name,
                content: newComment,
            }),
        });
        setNewComment('');
        // Refresh comments and count
        fetch(`http://localhost:8080/post/${postId}`)
            .then(res => res.json())
            .then(data => {
                setComments(data.comments || []);
                setCommentCount(data.comments?.length || 0);
            });
    };

    return (
        <div className="mt-2">
            <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-1 text-gray-500 hover:text-green-600"
            >
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">{commentCount} Komentar</span>
            </button>

            {showComments && (
                <>
                    <form onSubmit={handleAdd} className="flex gap-2 mb-2 mt-2">
                        <input
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Tulis komentar..."
                            className="flex-1 px-2 py-1 border rounded"
                            required
                        />
                        <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Kirim</button>
                    </form>
                    <div className="space-y-1">
                        {comments.map(c => (
                            <div key={c.id} className="text-xs bg-gray-50 rounded px-2 py-1 border border-gray-100">
                                <span className="font-semibold text-green-700">{c.username || 'User'}: </span>
                                {c.content}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default function Forum() {
    const { user } = useAuth();
    const [activeFilter, setActiveFilter] = useState("newest");
    const [posts, setPosts] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 4;
    const [userVotes, setUserVotes] = useState({});

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchUserVotes = async (posts) => {
        if (!user) return;
        const votes = {};
        for (const post of posts) {
            const res = await fetch('http://localhost:8080/get_vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: post.id, user_id: user.id })
            });
            const data = await res.json();
            votes[post.id] = data.vote_type;
        }
        setUserVotes(votes);
    };

    const fetchPosts = async () => {
        setLoading(true);
        const res = await fetch('http://localhost:8080/get_posts');
        const data = await res.json();
        setPosts(data);
        setLoading(false);
        await fetchUserVotes(data);
    };

    const handleImageUpload = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
            .from('forum-images') // Ganti dengan nama bucket Anda
            .upload(`public/${fileName}`, file);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from('forum-images').getPublicUrl(data.path);
        return urlData.publicUrl;
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!user) return;
        let imageUrl = '';
        if (selectedFile) {
            imageUrl = await handleImageUpload(selectedFile);
        }
        await fetch('http://localhost:8080/create_post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: user.id,
                username: user.user_metadata.full_name,
                title: newTitle,
                content: newContent,
                image_url: imageUrl,
            }),
        });
        setNewTitle('');
        setNewContent('');
        setSelectedFile(null);
        setPreviewUrl('');
        fetchPosts();
    };

    const handleVote = async (postId, voteType) => {
        await fetch('http://localhost:8080/vote_post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                post_id: postId,
                user_id: user.id,
                vote_type: voteType,
            }),
        });
        fetchPosts();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl('');
        }
    };

    // Filter posts by search
    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase())
    );

    // Calculate pagination
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="relative min-h-screen flex bg-[#3B5D3D]">
            <Sidebar user={user} />
            <div className="flex-1 p-4">
                {/* Main card container */}
                <div className="bg-white min-h-[calc(100vh-2rem)] rounded-3xl shadow-xl p-6">
                    <div className="max-w-7xl mx-auto h-full flex flex-col">
                        {/* Ornamen */}
                        <img src="/tomato.png" alt="" className="absolute left-0 bottom-0 w-32 opacity-80 pointer-events-none" />
                        <img src="/brain-icon.png" alt="" className="absolute right-8 top-8 w-20 opacity-80 pointer-events-none" />
                        <h1 className="text-5xl font-bold text-center text-green-700 mb-8">Forum</h1>
                        {/* Search Bar */}
                        <div className="flex items-center gap-2 mb-6">
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Cari pertanyaan atau isi forum..."
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col md:flex-row gap-8 flex-grow">
                            {/* Sidebar Forum */}
                            <div className="flex flex-col gap-6 w-full md:w-1/4">
                                <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
                                    <button
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left ${activeFilter === "newest" ? "bg-green-100 text-green-700 font-semibold" : "hover:bg-gray-100"}`}
                                        onClick={() => setActiveFilter("newest")}
                                    >
                                        <span className="w-3 h-3 rounded-full bg-green-400"></span>
                                        Newest and Recent
                                    </button>
                                    <button
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left ${activeFilter === "popular" ? "bg-green-100 text-green-700 font-semibold" : "hover:bg-gray-100"}`}
                                        onClick={() => setActiveFilter("popular")}
                                    >
                                        <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                                        Popular of the day
                                    </button>
                                    <button
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left ${activeFilter === "following" ? "bg-green-100 text-green-700 font-semibold" : "hover:bg-gray-100"}`}
                                        onClick={() => setActiveFilter("following")}
                                    >
                                        <span className="w-3 h-3 rounded-full bg-red-400"></span>
                                        Following <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">24</span>
                                    </button>
                                </div>
                                <div className="bg-white rounded-xl shadow p-4">
                                    <h2 className="font-semibold text-gray-700 mb-2">Popular Tags</h2>
                                    <ul className="flex flex-col gap-2">
                                        {tags.map((tag) => (
                                            <li key={tag.name} className="flex items-center gap-2 text-gray-600">
                                                <span className="bg-gray-200 px-2 py-0.5 rounded">{tag.name}</span>
                                                <span className="text-xs text-gray-400">{tag.count} Posts</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            {/* Main Content */}
                            <div className="flex-1 flex flex-col gap-6">
                                {/* Form Buat Post */}
                                {!!user && (
                                    <form onSubmit={handleCreatePost} className="bg-green-50 rounded-xl p-4 flex flex-col gap-2 mb-4">
                                        <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Judul pertanyaan..." className="px-3 py-2 rounded border" required />
                                        <textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Tulis pertanyaan Anda..." className="px-3 py-2 rounded border" required />
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <ImageIcon className="w-5 h-5 text-green-700" />
                                            <span className="text-sm text-gray-700">Pilih gambar (opsional)</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                        </label>
                                        {previewUrl && (
                                            <img src={previewUrl} alt="Preview" className="w-full max-h-48 object-cover rounded mb-2" />
                                        )}
                                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-semibold flex items-center gap-2 self-end"><Plus className="w-5 h-5" /> Tanya Forum</button>
                                    </form>
                                )}
                                {/* Daftar Post */}
                                {loading ? <div>Loading...</div> : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {currentPosts.map((post) => (
                                                <div key={post.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
                                                    {post.image_url && (
                                                        <img src={post.image_url} alt="Post" className="w-full max-h-48 object-cover rounded mb-2" />
                                                    )}
                                                    <h3 className="font-semibold text-gray-800">{post.title}</h3>
                                                    <div className="text-gray-600 text-sm mb-2">{post.content}</div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                                        <span>
                                                            User: {post.username ? post.username : post.user_id.slice(0, 8) + "..."}
                                                        </span>
                                                        <span>{new Date(post.created_at).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                                                        <button onClick={() => handleVote(post.id, 'like')} className={`flex items-center gap-1 ${userVotes[post.id] === 'like' ? 'text-red-600' : 'hover:text-green-600'}`}><Heart className="w-4 h-4" /> {post.like_count || 0}</button>
                                                        <button onClick={() => handleVote(post.id, 'unlike')} className={`flex items-center gap-1 ${userVotes[post.id] === 'unlike' ? 'text-red-600' : 'hover:text-red-600'}`}><ThumbsDown className="w-4 h-4" /> {post.unlike_count || 0}</button>
                                                    </div>
                                                    {/* Komentar */}
                                                    <CommentSection postId={post.id} user={user} />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <div className="flex justify-center gap-2 mt-6">
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className={`px-3 py-1 rounded ${currentPage === 1
                                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                        : 'bg-green-600 text-white hover:bg-green-700'
                                                        }`}
                                                >
                                                    Previous
                                                </button>
                                                {[...Array(totalPages)].map((_, index) => (
                                                    <button
                                                        key={index + 1}
                                                        onClick={() => handlePageChange(index + 1)}
                                                        className={`px-3 py-1 rounded ${currentPage === index + 1
                                                            ? 'bg-green-600 text-white'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                            }`}
                                                    >
                                                        {index + 1}
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className={`px-3 py-1 rounded ${currentPage === totalPages
                                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                        : 'bg-green-600 text-white hover:bg-green-700'
                                                        }`}
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}