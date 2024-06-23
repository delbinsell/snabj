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
              <div>
                <p className="mb-2 text-sm">{profile?.about || "Aún no has agregado información sobre ti."}</p>
                <button onClick={() => setIsEditingAbout(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md">Editar</button>
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




