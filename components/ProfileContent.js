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
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [aboutText, setAboutText] = useState(profile?.about || '');

  useEffect(() => {
    if (profile) {
      setAboutText(profile.about);
    }
  }, [profile]);


  useEffect(() => {
    if (!userId) {
      return;
    }
    if (activeTab === 'posts' || activeTab === 'photos') {
      loadPosts().then(() => {});
    }
    loadUserProfile(); // Cargar el perfil al montar el componente
  }, [userId, activeTab]);
  

  async function updateAbout() {
    const { error } = await supabase
      .from('profiles')
      .update({ about: aboutText })
      .eq('id', userId);
    if (error) {
      console.error(error);
    } else {
      setIsEditingAbout(false);
      loadUserProfile(); // Recargar el perfil después de actualizar
    }
  }
  

  async function loadPosts() {
    const postsData = await userPosts(userId);
    setPosts(postsData);
    loadUserProfile(); // Llamar a la función para cargar el perfil
  }
  
  async function loadUserProfile() {
    const profileData = await userProfile(userId);
    setProfile(profileData);
    setAboutText(profileData?.about); // Actualizar el estado del texto "Sobre mí"
  }
  

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
            <h2 className="text-3xl mb-2">Sobre mí</h2>
            {isEditingAbout ? (
              <div>
                <textarea
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md mb-2"
                />
                <button onClick={updateAbout} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Guardar</button>
                <button onClick={() => setIsEditingAbout(false)} className="bg-gray-300 text-black px-4 py-2 rounded-md">Cancelar</button>
              </div>
            ) : (
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 absolute right-0 top-0 cursor-pointer mt-0 mr-1"
                  onClick={() => setIsEditingAbout(true)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
                <p className="mb-2 text-sm">{profile?.about || "Aún no has agregado información sobre ti."}</p>
              </div>

            )}
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
              <img
                src={selectedPhoto}
                alt="Selected"
                className="max-w-screen-md max-h-screen-md"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}




