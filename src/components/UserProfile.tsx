import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

const UserProfile = () => {
  const { user, updateProfile } = useAuth();

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("UserProfile rendu - user :", user);
    if (user) {
      setEditForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await updateProfile(editForm);
    console.log("Résultat de la mise à jour :", response);

    if (response.success) {
      console.log("Mise à jour réussie. Nouvel utilisateur :", user);
      setMessage("Profil mis à jour avec succès.");
    } else {
      setMessage(response.error || "Erreur lors de la mise à jour.");
    }
  };

  return (
    <div>
      <h2>Mon Profil</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={editForm.firstName}
          onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
          placeholder="Prénom"
        />
        <input
          type="text"
          value={editForm.lastName}
          onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
          placeholder="Nom"
        />
        <input
          type="email"
          value={editForm.email}
          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
          placeholder="Email"
        />
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

export default UserProfile;
