import { useEffect, useState } from "react";
import axios from "axios";

export const ThingsList = () => {
    const [things, setThings] = useState([]);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [title, setTitle] = useState("");
    const [hp, setHp] = useState("");
    const [frontImg, setFrontImg] = useState("");
    const [backImg, setBackImg] = useState("");
    const [editingId, setEditingId] = useState(null);


    const getData = async () => {
        try {
            const response = await axios.get("http://localhost:3000/pokemons");
            setThings(response.data);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleSubmit = async () => {
        if (!title || !hp || !frontImg || !backImg) {
            setError("All data are required");
            return;
        }

        const newThing = {
            name: title,
            hp,
            img: frontImg,
            backImg,
        };

        try {
            if (editingId) {
                await axios.put(`http://localhost:3000/pokemons/${editingId}`, newThing);
            } else {
                await axios.post("http://localhost:3000/pokemons", newThing);
            }

            getData();
            setTitle("");
            setHp("");
            setFrontImg("");
            setBackImg("");
            setEditingId(null);

        } catch (error) {
            setError("Error");
        }
    };

    const handleEdit = (pokemon) => {
        setTitle(pokemon.name);
        setHp(pokemon.hp);
        setFrontImg(pokemon.img);
        setBackImg(pokemon.backImg);
        setEditingId(pokemon.id);
    };


    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/pokemons/${id}`);
            getData();
        } catch (error) {
            setError("Error deleting");
        }
    };



    const filteredThings = things.filter((thing) =>
        (thing.name || "").toLowerCase().startsWith(search.toLowerCase())
    ).reverse();

    return (
        <>
          <div className="py-6">
                <input
                    className="border rounded-4xl py-2 px-6"
                    type="text"
                    placeholder={`...search    ❤️`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="text-amber-700 text-2xl">{error}</div>

            <h1 className="text-3xl">Pokemon Searcher</h1>

            <form className="m-auto w-[99%] py-6 flex md:flex-row flex-col justify-between [&>label]:mx-2 [&>label>input]:px-2 [&>label>input]:border [&>label>input]:p-1 [&>label>input]:w-[99%] ">
                <label>
                    Name:
                    <input
                        type="text"
                        placeholder="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label>

                <label>
                    hp:
                    <input
                        type="text"
                        placeholder="hp"
                        value={hp}
                        onChange={(e) => setHp(e.target.value)}
                    />
                </label>

                <label>
                    Front Image URL:
                    <input
                        type="text"
                        placeholder="url"
                        value={frontImg}
                        onChange={(e) => setFrontImg(e.target.value)}
                    />
                </label>

                <label>
                    Back Image URL:
                    <input
                        type="text"
                        placeholder="url"
                        value={backImg}
                        onChange={(e) => setBackImg(e.target.value)}
                    />
                </label>
            </form>

            <div className="py-1 border-amber-800 mb-6 text-3xl">
                <button onClick={handleSubmit} onBlur={() => setError('')} className="border-amber-600">
                    Submit
                </button>
            </div>

          

            <div className="flex sm:flex-row md:flex-row flex-wrap gap-6  justify-around">
                {filteredThings.map((pokemon) => (
                    <div key={pokemon.id} className="flex flex-col w-[80%] sm:w-[45%] md:w-[25%] lg:w-[15%] border border-solid border-amber-50">
                        <img className="w-[99%] object-cover p-1.5" src={pokemon.img} alt={pokemon.name} />
                        <p>{pokemon.name}</p>
                        <p>❤️ {pokemon.hp} hp</p>
                        <div className="[&>button]:border-0 [&>button]:px-3">
                            <button className="border my-1 text-green-600" onClick={() => handleEdit(pokemon)} > Edit </button>
                            <button className="border my-1 text-red-600" onClick={() => handleDelete(pokemon.id)} > Delete </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
