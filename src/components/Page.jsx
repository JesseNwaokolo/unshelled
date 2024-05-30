import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import Items from "./Items";
import ReadMore from "./ReadMore";

function Page() {
  const [pageItems, setPageItems] = useState([]);
  const [generatingItems, setGeneratingItems] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(2);
  const [editId, setEditId] = useState();
  const [namer, setNamer] = useState();
  const [clearKeys, setClearKeys] = useState();
  const [editData, setEditData] = useState({
    id: editId,
    title: "",
    body: "",
  });

  useEffect(() => {
    async function fetch() {
      const response = await axios(
        "https://jsonplaceholder.typicode.com/posts"
      );
      const data = response.data.slice(1, 12);
      setPageItems(data);
      setGeneratingItems(false);
    }
    fetch();
  }, []);

  const lastIndex = currentPage * postPerPage;
  const firstIndex = lastIndex - postPerPage;
  const currentPost = pageItems.slice(firstIndex, lastIndex);

  const handleEdit = (id) => {
    setEditId(id);
    const currentItem = pageItems.filter((post) => {
      return post.id == id;
    });
    setEditData((prev) => {
      return { ...prev,id, title:currentItem[0].title, body:currentItem[0].body };
    });
  };

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setEditData((prev)=>{
        return {...prev, [name]:value}
    } )
  };

  const update = async () => {
    const response = await axios({
      method: "put",
      url:`https://jsonplaceholder.typicode.com/posts/${editData.id}`,
      data: editData,
    });
    const data = response.data

    const pageObject = pageItems.filter((o)=>{
        return o.id == editData.id
    })

    const index = pageItems.indexOf(pageObject[0])
    pageItems[index] = data
    setEditId()
  };

  const handleDelete = async (id)=>{
    setPageItems(pageItems.filter((u)=>{
        return u.id != id
    }))
  }

  return (
    <>
      {generatingItems ? (
        <div className="mx-auto font-bold">generatingItems....</div>
      ) : (
        <div className="mt-3 h-[70vh]">
          <div className="flex flex-col gap-y-3 items-center justify-center">
            {currentPost.map((items) => {
              return (
                <>
                  {editId == items.id ? (
                    <>
                      {" "}
                      <div
                        key={items.id}
                        className="w-[90%] lg:w-[50%] p-3 bg-red-400 flex flex-col gap-y-3"
                      >
                        <input
                          className="font-bold text-center"
                          placeholder={items.title}
                          value={editData.title}
                          name="title"
                          onChange={(e) => handleChange(e)}
                        />
                        <input
                          id={items.id}
                          name="body"
                          placeholder={items.body}
                          value={editData.body}
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                      <div className="flex justify-center w-[90%] lg:w-[50%] gap-x-4">
                        <button
                          className="border-2 p-4 bg-green-300"
                          onClick={update}
                        >
                          Update
                        </button>

                        <button
                          className="border-2 p-4 bg-red-800 text-white"
                          onClick={()=>setEditId(0)}
                        >
                          cancel
                        </button>
                      </div>{" "}
                    </>
                  ) : (
                    <>
                      {" "}
                      <div
                        key={items.id}
                        className="w-[90%] lg:w-[50%] p-3 bg-[#9e613b] rounded-md"
                      >
                        <h2 className="font-bold text-center text-white ">{items.title}</h2>
                        <ReadMore id={items.id} text={items.body} />
                      </div>
                      <div className="border-b-1 flex justify-center w-[90%] lg:w-[50%] gap-x-4">
                        <button
                          className="border-2 p-4 bg-yellow-300 rounded-md"
                          onClick={() => handleEdit(items.id)}
                        >
                          Edit
                        </button>
                        <button className="border-2 p-4 bg-red-300 rounded-md" onClick={()=>handleDelete(items.id)}>
                          Delete
                        </button>
                      </div>{" "}
                    </>
                  )}
                </>
              );
            })}
          </div>
        </div>
      )}

      <Items
        total={pageItems.length}
        postPerPage={postPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </>
  );
}

export default Page;
