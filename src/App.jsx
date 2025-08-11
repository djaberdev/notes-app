import { useState, useRef, useEffect } from "react";
import errorImg from "./assets/error.png";
import defaultProfile from "./assets/default.png";

// Import All The Profile Pictures (Avatars)
import avatar1 from "./assets/profile-01.png";
import avatar2 from "./assets/profile-02.png";
import avatar3 from "./assets/profile-03.png";
import avatar4 from "./assets/profile-04.png";

function App() {

    // Settings & Variables 
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    const categories = [
        {
            categoryName: "personal",
            categoryIcon: <i className="ri-user-3-fill"></i>,
        },
        
        {
            categoryName: "work",
            categoryIcon: <i className="ri-tools-fill"></i>,
        },
        
        {
            categoryName: "ideas",
            categoryIcon: <i className="ri-brain-2-fill"></i>,
        },
        
        {
            categoryName: "sport",
            categoryIcon: <i className="ri-football-fill"></i>,
        },
        
        {
            categoryName: "learning",
            categoryIcon: <i className="ri-book-marked-fill"></i>,
        },
        
        {
            categoryName: "important",
            categoryIcon: <i className="ri-error-warning-fill"></i>,
        },
        
        {
            categoryName: "other",
            categoryIcon: <i className="ri-question-mark"></i>,
        },
    ];
    const filters = [
        "all",
        "personal",
        "work",
        "ideas",
        "sport",
        "learning",
        "important",
        "other",
    ];
    const profilePictures = [avatar1, avatar2, avatar3, avatar4];

    // A Function To Initialize The 'notesArray' State
    function notesInitializer() {
        let storedNotes = window.localStorage.getItem("notes");
        return storedNotes ? JSON.parse(storedNotes) : [];
    }

    // A Function To Initialize The 'userData' State
    function userInitializer() {
        let storedData = window.localStorage.getItem("user-data");
        return storedData ? JSON.parse(storedData) : { avatar: defaultProfile, username: "Unknown" };
    }

    // States
    const [notesArray, setNotesArray] = useState(notesInitializer);
    const [expandedNote, setExpandedNote] = useState(null); // Store the expanded note object
    const [categoryState, setCategoryState] = useState("other");
    const [userData, setUserData] = useState(userInitializer);
    const [avatarState, setAvatarState] = useState(userData.avatar);
    const [usernameState, setUsername] = useState(userData.username);

    // Refs
    const lightBoxRef = useRef(null);
    const expandScreenRef = useRef(null);
    const filtersRef = useRef(null);
    const titleInputRef = useRef(null);
    const contentTextareaRef = useRef(null);
    const userAreaRef = useRef(null);
    const avatarRef = useRef(null);
    const usernameRef = useRef(null);

    // Mian Functions
    function addNote() {
        
        // Get The Entered Values
        let noteTitle = titleInputRef.current.value;
        let noteContent = contentTextareaRef.current.value;

        // Validate Input & Textarea
        if (noteTitle.trim() !== "" || noteContent.trim() !== "") {

            // Create The Note Object 
            const noteObject = {
                id: generateID(),
                title: noteTitle || "N/A",
                content: noteContent || "N/A",
                addingDate: new Date(),
                category: categoryState
            };

            setNotesArray(na => [...na, noteObject]);

            titleInputRef.current.value = "";
            contentTextareaRef.current.value = "";
            setCategoryState("other");

        } else alert("Inputs mustn't be empty!");

    }

    function formatDate(time) {

        /*
            - Convert The 'time' Into A Date Object Because It
              Has Been Retrieved From Local Storage As A String
              The Same Thing In 'formatFullDate()' Function
        */
        const validTime = new Date(time);
        
        let year = validTime.getFullYear();
        let month = months[validTime.getMonth()];
        let monthDay = validTime.getDate();

        return `${month} ${monthDay}, ${year}`;
        
    };

    function formatFullDate(time) {

        const validTime = new Date(time);

        let year = validTime.getFullYear();
        let month = months[validTime.getMonth()];
        let monthDay = validTime.getDate();
        let hours = validTime.getHours();
        let minutes = validTime.getMinutes();
        let meridium;

        hours = hours < 10 ? `0${hours}` : hours ;
        minutes = minutes < 10 ? `0${minutes}` : minutes ;

        meridium = hours < 12 ? "AM" : "PM" ;

        return `${month} ${monthDay}, ${year} ${hours}:${minutes} ${meridium}`;
    }

    function deleteNote(index) {
        const notesArrayCopy = [...notesArray];
        const filterdNotes = notesArrayCopy.filter((_, i) => index !== i);
        setNotesArray([...filterdNotes]);
    }

    function generateID() {
        let randomValue = Math.floor(Math.random() * 1000);
        return `N-${randomValue}`;
    }

    function filterNotes(chosenfilter, event) {

        // Check If There Is Exist Notes
        if (notesArray.length > 0) {

            const existNotes = Array.from(document.querySelectorAll(".note-card"));
            const existFilters = Array.from(document.querySelectorAll(".filter-btn"));

            // Remove The 'active' Class From All Filters & Add It To The Chosen One
            existFilters.forEach((el) => el.classList.remove("active"));
            event.target.classList.add("active");

            // Hide All The 'existNotes'
            existNotes.forEach(note => note.style.display = "none");

            // Get & Show The Filtred Notes
            let filteredNotes = existNotes.filter(note => {
                return note.getAttribute("data-filter").includes(chosenfilter);
            })
            filteredNotes.forEach(filteredNote => filteredNote.style.display = "flex");

        } else alert("There is no notes to filter!");

    };

    // Save Data To Local Storage Whenever The 'notesArray' Change
    useEffect(() => {
        window.localStorage.setItem("notes", JSON.stringify(notesArray));
    }, [notesArray]);

    // Save User Data To Local Storage Whenever The 'avatarState' or The 'usernameState' Change
    useEffect(() => {
        
        let userData = {
            avatar: avatarState,
            username: usernameState
        };

        setUserData(userData);

        window.localStorage.setItem("user-data", JSON.stringify(userData));

        // Display The 'userData'
        avatarRef.current.setAttribute("src", avatarState);
        usernameRef.current.textContent = usernameState;

    }, [avatarState, usernameState]);

    return (

        <main>
            <nav className="flex-center-between">
                <div className="left flex-align-center">
                    <img 
                        ref={avatarRef}
                        alt="profile pic"
                        onClick={() => userAreaRef.current.classList.toggle("show")}
                    />
                    <h3 ref={usernameRef}></h3>
                </div>
                <div className="right flex-align-center">
                    <button 
                        title="Add Note"
                        onClick={() => lightBoxRef.current.classList.add("show")}
                    >
                        <i className="ri-add-fill"></i>
                    </button>
        
                    <button
                        title="Filter Notes"
                        onClick={() => {
                            filtersRef.current.classList.toggle("show");
                            
                            // Disable The Ability To Delete Notes
                            Array.from(document.querySelectorAll("#delete-btn")).forEach(delBtn => delBtn.classList.toggle("disabled"));
                        }}
                    >
                        <i className="ri-filter-3-fill"></i>
                    </button>

                    <button
                        title="Clear All"
                        onClick={() => {
                            setNotesArray([]);
                            setAvatarState(defaultProfile);
                            setUsername("Unknown");
                        }}
                    >
                        <i className="ri-restart-line"></i>
                    </button>
                </div>

                <div ref={filtersRef} className="filters">
                    {
                        filters.length > 0
                        ? (
                            filters.map((filter, index) => (
                                <span 
                                    key={index}
                                    className={index === 0 ? "filter-btn active" : "filter-btn"}
                                    onClick={(e) => filterNotes(filter, e)}
                                >{filter}</span>
                            ))
                        )
                        : (
                            <p>Filters are not available!</p>
                        )
                    }
                </div>

                <div ref={userAreaRef} className="profile-area">
                    <input 
                        type="text"
                        placeholder="Enter username..."
                        value={usernameState}
                        maxLength={10}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <div className="pictures">
                        {
                            profilePictures.length > 0
                            ? (
                                profilePictures.map((avatar, index) => (
                                    <div className="avatar-box" key={index}>
                                        <input 
                                            type="radio"
                                            value={avatar}
                                            name="avatar"
                                            id={"avatar-input-" + (index + 1)}
                                            onChange={(e) => setAvatarState(e.target.value)}
                                            checked={avatar === avatarState}
                                        />
                                        <label htmlFor={"avatar-input-" + (index + 1)}>
                                            <img src={avatar} alt={"Avatar" + (index + 1)}/>
                                        </label>
                                    </div>
                                ))
                            )
                            : (
                                <p>Profile pictures are not available!</p>
                            )
                        }
                    </div>
                </div>
            </nav>

            <section className="notes-area">        

                {
                    notesArray.length > 0
                    ? (
                        <div className="notes-container">
                            {notesArray.map((noteObj, index) => (
                                <div className="note-card" key={index} data-filter={"all " + noteObj.category}>
                                    <div className="text">
                                        <h2>{noteObj.title}</h2>
                                        <p>{noteObj.content}</p>
                                    </div>
                                    <div className="details flex-center-between">
                                        <span>{formatDate(noteObj.addingDate)}</span>
                                        <div className="buttons flex-align-center">
                                            <button
                                                id="delete-btn"
                                                title="Delete Note"
                                                onClick={() => deleteNote(index)}
                                            >
                                                <i className="ri-delete-bin-5-line"></i>
                                            </button>
                                            <button
                                                id="expand-btn" 
                                                title="Expand Note"
                                                onClick={() => {
                                                    expandScreenRef.current.classList.add("show");
                                                    setExpandedNote(noteObj);
                                                }}
                                            >
                                                <i className="ri-expand-diagonal-line"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                    : (
                        <div className="error-box">
                            <img src={errorImg} alt="Error Image" />
                            <h2>No notes to show.</h2>
                        </div>
                    )
                }

            </section>

            <div ref={lightBoxRef} className="light-box">
                <form>
                    <div className="head flex-center-between">
                        <h3>Add New Note</h3>
                        <i 
                            className="ri-close-large-fill close-btn"
                            onClick={() => lightBoxRef.current.classList.remove("show")} 
                        ></i>
                    </div>
                
                    <div className="inputs">
                        <div className="categories">
                            <label>Categories</label>
                            <div className="container">
                                {
                                    categories.length > 0
                                    ? (
                                        categories.map((categoryObj, index) => (
                                            <div className="category-box" key={index}>
                                                <input
                                                    type="radio"
                                                    id={"category-input-" + (index + 1)}
                                                    value={categoryObj.categoryName}
                                                    name="category"
                                                    onChange={(e) => setCategoryState(e.target.value)}
                                                    checked={categoryState === categoryObj.categoryName}
                                                />
                                                <label htmlFor={"category-input-" + (index + 1)}>
                                                    {categoryObj.categoryIcon}
                                                    <span>{categoryObj.categoryName}</span>
                                                </label>
                                            </div>
                                        ))
                                    )
                                    : (
                                        <p>Categories are not available!</p>
                                    )
                                }
                            </div>
                        </div>

                        <div className="input-box">
                            <label>Title</label>
                            <input
                                ref={titleInputRef} 
                                type="text"
                            />
                        </div>
                        <div className="input-box">
                            <label>Content</label>
                            <textarea 
                                ref={contentTextareaRef}
                                style={{ resize: "none", height: "150px" }}
                            ></textarea>
                        </div>
                        <input 
                            type="submit" 
                            value="Add Note" 
                            onClick={(e) => {
                                e.preventDefault();
                                lightBoxRef.current.classList.remove("show");
                                addNote();
                            }}
                        />
                    </div>
                </form>
            </div>

            <div ref={expandScreenRef} className="expand-screen flex-all-center">
                { expandedNote && (
                    <div className="expanded-note">
                        <div className="title-area flex-center-between">
                            <div>
                                <i className="ri-hashtag"></i>
                                <h2>{expandedNote.title}</h2>
                            </div>
                            <i 
                                className="ri-close-large-fill close-btn"
                                onClick={() => {
                                    setExpandedNote(null)
                                    expandScreenRef.current.classList.remove("show");
                                }}
                            ></i>
                        </div>
                        <div className="content-area">
                            <span className="content-info">{(expandedNote.content).toString().length} Characters</span>
                            <p>{expandedNote.content}</p>
                        </div>
                        <div className="details-area flex-center-between">
                            <span className="fulldate" title="Note Full Adding Date">{formatFullDate(expandedNote.addingDate)}</span>
                            <div className="id" title="Note ID">
                                <i className="ri-at-line"></i>
                                <span>{expandedNote.id}</span>
                            </div>
                            <div className="category" title="Note Category">
                                <i className="ri-attachment-line"></i>
                                <span>{expandedNote.category}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>

    );
}

export default App;