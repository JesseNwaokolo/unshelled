import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import Items from "./Items";

function Page() {
  const [pageItems, setPageItems] = useState([]);
  const [generatingItems, setGeneratingItems] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(2);
  const [editId, setEditId] = useState(-1);
  const [namer, setNamer] = useState();
  const [clearKeys, setClearKeys] = useState()
  const [editData, setEditData] = useState({
    id: editId,
    data: {},
  });

  useEffect(() => {
    async function fetch() {
      const response = await axios("https://api.restful-api.dev/objects");
      const data = response.data.filter((data) => data.data !== null);
      console.log(data);
      setPageItems(data);
      setGeneratingItems(false);
    }
    fetch();
  }, []);

  const lastIndex = currentPage * postPerPage;
  const firstIndex = lastIndex - postPerPage;
  const currentPost = pageItems.slice(firstIndex, lastIndex);


const clear = ()=>{
    clearKeys.map((u,i)=>{
        localStorage.removeItem(`${u}`)
      })
}

  const handleEdit = (id, data, name) => {
    setEditId(id);
    setNamer(name);
    localStorage.setItem("data", JSON.stringify(data));
  };

  const handleChange = (e) => {
    const data = {};
    var name = e.target.name;
    var value = e.target.value;
    localStorage.setItem(`${name}`, value);
    const localdata = localStorage.getItem("data");
    const localdatajson = JSON.parse(localdata);
    const keys = Object.keys(localdatajson);
    setClearKeys(keys)
    const val = keys.map((v, i) => {
      return localStorage.getItem(v);
    });

    keys.forEach((k, i) => {
      data[k] = val[i];
    });

    setEditData((prev) => {
      return { ...prev, data, name: namer, id: editId };
    });

    console.log(editData);
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setEditData((prev) => {
      return { ...prev, name, id: editId };
    });
  };

  const update = async (id) => {

    await axios({
      method:'patch',
      url:`https://api.restful-api.dev/objects/${id}`,
      data:editData,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
  
    });

    clear()
  };

  const Delete = async (id) => {

    await axios({
      method:'delete',
      url:`https://api.restful-api.dev/objects/${id}`,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
  
    });

    clear()
  };

  console.log(editData);

  return (
    <>
    {generatingItems? <div className="mx-auto font-bold">generatingItems....</div> : 
     <> <div className="flex flex-col gap-y-2 items-center mt-3">
        {currentPost.map((items, index) => {
          const data = Object.entries(items.data).map(([key, val], index) => {
            return (
              <div key={index}>
                <p className="mb-1">
                  {editId == items.id ? (
                    <>
                      <b>{key}</b> :{" "}
                      <input
                        type="text"
                        placeholder={val}
                        name={key}
                        onChange={(e) => handleChange(e)}
                        className="text-black"
                      />
                    </>
                  ) : (
                    <>
                      <b>{key}</b> : <span>{val}</span>
                    </>
                  )}
                </p>
              </div>
            );
          });
          return (
            <div
              key={index}
              className="bg-[#b9314f] w-full lg:w-[50%] flex flex-col items-center rounded-lg text-[#e1dee3]"
            >
              {editId == items.id ? (
                <>
                  <input
                    type="text"
                    placeholder={items.name}
                    className="mb-1 text-black"
                    name="name"
                    onChange={(e) => handleNameChange(e)}
                  />
                </>
              ) : (
                <h2>{items.name}</h2>
              )}

              <div>{data}</div>
              <div id="options " className="flex gap-x-3">
                {editId == items.id ? (
                  <button
                    className="p-1 bg-green-400 text-white mb-1"
                    onClick={()=> update(items.id)}
                  >
                    Update
                  </button>
                ) : (
                  <>
                    {" "}
                    <button
                      className="bg-yellow-500 p-1 m-1 rounded-md text-white"
                      onClick={() =>
                        handleEdit(items.id, items.data, items.name)
                      }
                    >
                      Edit
                    </button>
                    <button className="bg-red-500 p-1 m-1 rounded-md text-white"  onClick={()=> Delete(items.id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Items
        total={pageItems.length}
        postPerPage={postPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </>
  
}
</>
  );
}

export default Page;
