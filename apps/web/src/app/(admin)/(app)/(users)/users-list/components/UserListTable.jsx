import { useEffect, useState } from "react";
import { getUsers, createUser, getBranches } from "../../api";
import { LuPlus, LuSearch } from "react-icons/lu";
import Alert from "@/components/Alert";

const UserListTable = () => {

  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    email: "",
    role: "admin",
    branches_ids: []
  });

  const [selectedBranch, setSelectedBranch] = useState("");

  /* ========================
     ALERT STATE
  ======================== */

  const [alert, setAlert] = useState(null);

  function showAlert(type, message) {
    setAlert({ type, message });

    setTimeout(() => {
      setAlert(null);
    }, 4000);
  }

  useEffect(() => {
    loadUsers();
    loadBranches();
  }, []);

  async function loadUsers() {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      showAlert("error", "Error cargando usuarios");
    }
  }

  async function loadBranches() {
    try {
      const data = await getBranches();
      setBranches(data);
    } catch (err) {
      console.error(err);
      showAlert("error", "Error cargando sucursales");
    }
  }

  /* ========================
     ADD BRANCH TO LIST
  ======================== */

  function addBranch() {

    if (!selectedBranch) return;

    if (form.branches_ids.includes(selectedBranch)) {
      showAlert("warning", "Sucursal ya agregada");
      return;
    }

    setForm({
      ...form,
      branches_ids: [...form.branches_ids, selectedBranch]
    });

    setSelectedBranch("");
  }

  function removeBranch(id) {

    setForm({
      ...form,
      branches_ids: form.branches_ids.filter(b => b !== id)
    });

  }

  /* ========================
     CREATE USER
  ======================== */

  async function handleSubmit(e) {

    e.preventDefault();

    try {

      await createUser({
        email: form.email,
        role: form.role,
        branches_ids: form.branches_ids
      });

      showAlert("success", "Usuario creado correctamente");

      setShowModal(false);

      setForm({
        email: "",
        role: "admin",
        branches_ids: []
      });

      loadUsers();

    } catch (err) {
      showAlert("error", err.message || "Error creando usuario");
    }
  }

  /* ========================
     HELPER
  ======================== */

  function getBranchName(id) {
    const branch = branches.find(b => b.id === id);
    return branch ? branch.name : id;
  }

  return (
    <div className="card">

      {/* ALERT */}

      {alert && (
        <div className="mb-4">
          <Alert type={alert.type} message={alert.message} />
        </div>
      )}

      {/* HEADER */}

      <div className="card-header flex justify-between items-center">

        <h6 className="card-title">Lista de Usuarios</h6>

        <button
          className="btn btn-sm bg-primary text-white"
          onClick={() => setShowModal(true)}
        >
          <LuPlus className="size-4 me-1" />
          Add user
        </button>

      </div>

      {/* SEARCH */}

      <div className="card-header">

        <div className="relative w-64">

          <input
            className="form-input form-input-sm ps-9"
            placeholder="Search email"
          />

          <div className="absolute inset-y-0 start-0 flex items-center ps-3">
            <LuSearch className="size-3.5 text-default-500" />
          </div>

        </div>

      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">

        <table className="min-w-full divide-y divide-default-200">

          <thead className="bg-default-150">

            <tr className="text-sm text-default-700 whitespace-nowrap">
              <th className="px-3.5 py-3 text-start">ID</th>
              <th className="px-3.5 py-3 text-start">Email</th>
              <th className="px-3.5 py-3 text-start">Role</th>
              <th className="px-3.5 py-3 text-start">Branches</th>
            </tr>

          </thead>

          <tbody>

            {users.map(user => (

              <tr key={user.id} className="text-sm">

                <td className="px-3.5 py-3 text-primary">
                  {user.id}
                </td>

                <td className="px-3.5 py-3">
                  {user.email}
                </td>

                <td className="px-3.5 py-3">
                  {user.role}
                </td>

                <td className="px-3.5 py-3">

                  {user.branch_ids?.length ? (
                    user.branch_ids.map(id => (
                      <span
                        key={id}
                        className="bg-primary/10 text-primary text-xs px-2 py-1 rounded mr-2"
                      >
                        {getBranchName(id)}
                      </span>
                    ))
                  ) : (
                    "-"
                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>


      {/* ========================
         MODAL CREATE USER
      ======================== */}

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-lg w-[450px]">

            <h3 className="text-lg font-semibold mb-4">
              Crear Usuario
            </h3>

            <form onSubmit={handleSubmit}>

              <input
                className="form-input w-full mb-3"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />

              <select
                className="form-input w-full mb-3"
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
              >
                <option value="admin">Admin</option>
                <option value="therapist">Therapist</option>
                <option value="receptionist">Receptionist</option>
              </select>

              <div className="flex gap-2 mb-3">

                <select
                  className="form-input flex-1"
                  value={selectedBranch}
                  onChange={(e) =>
                    setSelectedBranch(e.target.value)
                  }
                >

                  <option value="">
                    Seleccionar sucursal
                  </option>

                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}

                </select>

                <button
                  type="button"
                  className="btn bg-primary text-white"
                  onClick={addBranch}
                >
                  +
                </button>

              </div>

              <div className="mb-4">

                {form.branches_ids.map(id => (

                  <span
                    key={id}
                    className="bg-primary text-white text-xs px-2 py-1 rounded mr-2 cursor-pointer"
                    onClick={() => removeBranch(id)}
                  >
                    {getBranchName(id)} ✕
                  </span>

                ))}

              </div>

              <div className="flex gap-2">

                <button
                  type="submit"
                  className="btn bg-primary text-white flex-1"
                >
                  Crear
                </button>

                <button
                  type="button"
                  className="btn bg-gray-200 flex-1"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default UserListTable;