import PostCard from "./PostCard";
import Card from "./Card";
import FriendInfo from "./FriendInfo";
import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function ProfileContent({ activeTab, userId }) {
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null); // Estado para la foto seleccionada
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!userId) {
      return;
    }
    if (activeTab === 'posts' || activeTab === 'photos') {
      loadPosts().then(() => { });
    }
  }, [userId, activeTab]);

  async function loadPosts() {
    const postsData = await userPosts(userId);
    const profileData = await userProfile(userId);
    setPosts(postsData);
    setProfile(profileData);
  }

  async function userPosts(userId) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('author', userId);
    if (error) {
      console.error(error);
      return [];
    }
    return data;
  }

  async function userProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select()
      .eq('id', userId);
    return data?.[0];
  }

  function handlePhotoClick(photoUrl) {
    setSelectedPhoto(photoUrl);
  }

  function closeModal() {
    setSelectedPhoto(null);
  }

  return (
    <div>
      {activeTab === 'posts' && (
        <div>
          {posts?.length > 0 && posts.map(post => (
            <PostCard key={post.created_at} {...post} profiles={profile} />
          ))}
        </div>
      )}
      {activeTab === 'about' && (
        <div>
          <Card>
            <h2 className="text-3xl mb-2">About me</h2>
            <p className="mb-2 text-sm">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut doloremque harum maxime mollitia perferendis praesentium quaerat. Adipisci, delectus eum fugiat incidunt iusto molestiae nesciunt odio porro quae quaerat, reprehenderit, sed.</p>
            <p className="mb-2 text-sm">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet assumenda error necessitatibus nesciunt quas quidem quisquam reiciendis, similique. Amet consequuntur facilis iste iure minima nisi non praesentium ratione voluptas voluptatem?</p>
          </Card>
        </div>
      )}
      {activeTab === 'friends' && (
        <div>
          <Card>
            <h2 className="text-3xl mb-2">Friends</h2>
            <div className="">
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
            </div>
          </Card>
        </div>
      )}
      {activeTab === 'photos' && (
        <div>
          <Card>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {posts?.length > 0 && posts.map(post => (
                post.photos && post.photos.length > 0 && post.photos.map((photoUrl, index) => (
                  <div
                    key={index}
                    className="relative w-full h-48 overflow-hidden rounded-md cursor-pointer"
                    onClick={() => handlePhotoClick(photoUrl)}
                  >
                    <img
                      src={photoUrl}
                      alt="User photo"
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))
              ))}
            </div>
          </Card>
          {selectedPhoto && (
            <div
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
              onClick={closeModal}
            >
              <div className="relative p-4 bg-white rounded-md shadow-md">
                <img
                  src={selectedPhoto}
                  alt="Selected"
                  className="max-w-full max-h-96"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


