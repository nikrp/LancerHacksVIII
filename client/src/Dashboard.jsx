import { PiFireSimpleFill, PiSparkleFill, PiStarFill } from "react-icons/pi";
import axios from 'axios';
import { useEffect, useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ToastContainer, toast } from "react-toastify";
import { GrRefresh } from "react-icons/gr";
import { VscLoading } from "react-icons/vsc";

export default function Dashboard({ supabase }) {
    const [randomQuote, setRandomQuote] = useState(undefined);
    const [entryContent, setEntryContent] = useState("");
    const [mood, setMood] = useState("😐");
    const [uuid, setUuid] = useState(undefined);
    const [journalEntries, setJournalEntries] = useState([]);
    const [filteredEntries, setFilteredEntries] = useState([]);
    const [summary, setSummary] = useState(undefined);
    const [improvement, setImprovement] = useState(undefined);
    const [search, setSearch] = useState("");

    const messagesEndRef = useRef(null);

    const genAi = new GoogleGenerativeAI("AIzaSyABZF7vDJtQ8rZFAo0FQ8lfZemJLA6jBKc");
    const model = genAi.getGenerativeModel({ model: "gemini-2.0-flash" });

    const testPrompt = "This data is about a specific user in the last week. Generate a short 3 sentence summary about their moods over the week, specifically what types of things makes them not feel good. Phrase it like you are talking directly to the user.";
    const improvementPrompt = "I just gave you some data about the mood of a user over this past week. Give me 3 short suggestions that this user could do to improve their mood and bring it up to 'amazing' based on what makes them not feel 'amazing'. Phrase it like you are talking to the user. Numbered, and small one sentence titles that explain the list item. Use new lines and more. Seperate list items with new lines. Don't give an introduction, just the list. Do not make it specific to what the user did, just in general.";

    function getWeekDay(weekday) {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = weekday - dayOfWeek;
        const date = new Date(today);
        date.setDate(today.getDate() + diff);
        return date.getDate();
    }

    async function geminiTest(data) {
        const response = await model.generateContent(JSON.stringify(data.slice(0, 7), 2, null) + "\n" + testPrompt);
        setSummary(response.response.text());
        
        const response2 = await model.generateContent(JSON.stringify(data.slice(0, 7), 2, null) + improvementPrompt);
        setImprovement(response2.response.text()
            .replace(/\*(.*?)\*/g, "<b>$1</b>") // Bold the asterisked text
            .replace(/(?<!^)\s*(\d+\.)/g, "<br><br>$1") // Add a newline before numbers except the first one
            .trim() // Clean up extra spaces
        );    
    }

    async function getJournalEntries() {
        const response = await supabase.auth.getSession();
        const uuid = response.data.session.user.id;
        setUuid(uuid);

        const { data, error } = await supabase.from("moods").select().eq("user_id", uuid);
        setJournalEntries(data);
        setFilteredEntries(data);
        geminiTest(data);
    }

    useEffect(() => {
        async function getDailyQuote() {
            const response = await axios.get("https://api.api-ninjas.com/v1/quotes", {
                headers: {
                    "X-Api-Key": "CdTqPh+WNqPRKkhWZ+akhg==qvuIFpUZ4CG77bqI",
                },
            });

            console.log(response.data[0]);
            setRandomQuote(response.data[0]);
        }

        getDailyQuote();
        getJournalEntries();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [journalEntries]);

    async function submitEntry() {
        const { error } = await supabase.from("moods").insert({ user_id: uuid, mood: mood, journal_entry: entryContent })
        setEntryContent("");
        setMood("😐");
        toast.success("Successfully added journal entry!");
        getJournalEntries();
    }

    return (
        <div data-theme="green" className={`min-h-screen bg-base-200 flex flex-col items-center justify-center p-5`}>
            <p className={`text-4xl font-bold text-base-content`}>Feeling</p>
            <p className={`text-xl font-semibold my-3`}>Welcome, nikrp123</p>
            <div className={`rounded-xl w-11/12 grid grid-cols-12 gap-2`}>
                <div className={`col-span-4 flex flex-col gap-2`}>
                    <div className={`p-5 rounded-lg bg-base-100 border border-base-300`}>
                        <p className={`text-base-content font-medium`}>Your Streak</p>
                        <p className={`text-base-content text-3xl flex items-end gap-2`}><PiFireSimpleFill className={`fill-red-500`} size={30} />0 days</p>
                    </div>
                    <div className={`p-5 rounded-lg bg-base-100 border border-base-300`}>
                        <div className={`grid grid-cols-7`}>
                            <div className={`rounded-lg px-3 py-2 w-full`}>
                                <p className={`opacity-100 text-center text-base-content font-semibold`}>{getWeekDay(1)}</p>
                                <p className={`opacity-60 text-base-content mx-auto text-xs text-center font-semibold`}>M</p>
                            </div>
                            <div className={`rounded-lg px-3 py-2 w-full`}>
                                <p className={`opacity-100 text-center text-base-content font-semibold`}>{getWeekDay(2)}</p>
                                <p className={`opacity-60 text-base-content mx-auto text-xs text-center font-semibold`}>T</p>
                            </div>
                            <div className={`rounded-lg px-3 py-2 w-full`}>
                                <p className={`opacity-100 text-center text-base-content font-semibold`}>{getWeekDay(3)}</p>
                                <p className={`opacity-60 text-base-content mx-auto text-xs text-center font-semibold`}>W</p>
                            </div>
                            <div className={`rounded-lg px-3 py-2 w-full`}>
                                <p className={`opacity-100 text-center text-base-content font-semibold`}>{getWeekDay(4)}</p>
                                <p className={`opacity-60 text-base-content mx-auto text-xs text-center font-semibold`}>T</p>
                            </div>
                            <div className={`rounded-lg px-3 py-2 w-full`}>
                                <p className={`opacity-100 text-center text-base-content font-semibold`}>{getWeekDay(5)}</p>
                                <p className={`opacity-60 text-base-content mx-auto text-xs text-center font-semibold`}>F</p>
                            </div>
                            <div className={`rounded-lg px-3 py-2 w-full bg-primary`}>
                                <p className={`opacity-100 text-center text-primary-content font-semibold`}>{getWeekDay(6)}</p>
                                <p className={`opacity-60 text-primary-content mx-auto text-xs text-center font-semibold`}>S</p>
                            </div>
                            <div className={`rounded-lg px-3 py-2 w-full`}>
                                <p className={`opacity-100 text-center text-base-content font-semibold`}>{getWeekDay(7)}</p>
                                <p className={`opacity-60 text-base-content mx-auto text-xs text-center font-semibold`}>S</p>
                            </div>
                        </div>
                        <p className={`font-semibold text-base-content text-center mt-3`}>Daily Quote</p>
                        {randomQuote === undefined ? (
                            <VscLoading size={30} className={`mx-auto animate-spin`} />
                        ) : (
                            <>
                                <p className={`text-accent opacity-60 text-center text-lg my-1.5`}>{randomQuote.quote}</p>
                                <p className={`text-center text-primary`}>- {randomQuote.author}</p>
                            </>
                        )}
                        
                    </div>
                </div>
                <div className={`col-span-4 flex flex-col gap-2`}>
                    <label className="input w-full bg-base-100 border border-base-300">
                        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
                        <input 
                            onChange={(e) => {
                                const query = e.target.value.toLowerCase();
                                setSearch(query);
                                setFilteredEntries(journalEntries.filter((entry) => 
                                    entry.journal_entry.toLowerCase().includes(query)
                                ));
                                console.log(entries.filter((entry) => 
                                    entry.journal_entry.toLowerCase().includes(query)
                                ));
                            }} 
                            value={search}
                            type="search" 
                            className="grow w-full" 
                            placeholder="Search" 
                        />
                    </label>
                    <div className={`p-5 rounded-lg bg-base-100 border border-base-300`}>
                        <p className={`font-medium text-base-content mb-2 flex items-center justify-between`}>Your Journal Logs<GrRefresh onClick={getJournalEntries} size={30} className={`p-2 transition-all rounded-lg cursor-pointer hover:bg-base-300`} /></p>
                        <div id={`entries-container`} className={`flex flex-col gap-5 max-h-65 overflow-y-scroll`}>
                            {filteredEntries.length === 0 ? (
                                <p className={`text-black opacity-50`}>Write a new log for it to show up here!</p>
                            ) : filteredEntries.map((entry, index) => {
                                const date = new Date(entry.created_at);

                                const formattedDate = date.toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                });

                                const formattedTime = date.toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true
                                });

                                return (
                                    <div key={index}>
                                        <p className={`text-accent text-sm opacity-70 mb-2`}>{formattedDate + " " + formattedTime}</p>
                                        <div className={`flex items-start gap-2`}>
                                            <p className={`text-5xl`}>{entry.mood}</p>
                                            <p className={`text-base-content`}>{entry.journal_entry}</p>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} /> {/* Invisible div to scroll to */}
                        </div>
                    </div>
                    <div className={`p-5 rounded-lg bg-base-100 border border-base-300 flex flex-col items-center`}>
                        <div className={`flex items-center gap-2 mx-auto`}>
                            <p onClick={() => setMood("😃")} className={`p-3 text-lg rounded-lg cursor-pointer ${mood === "😃" && `bg-base-300`}`}>😃</p>
                            <p onClick={() => setMood("🙂")} className={`p-3 text-lg rounded-lg cursor-pointer ${mood === "🙂" && `bg-base-300`}`}>🙂</p>
                            <p onClick={() => setMood("😐")} className={`p-3 text-lg rounded-lg cursor-pointer ${mood === "😐" && `bg-base-300`}`}>😐</p>
                            <p onClick={() => setMood("😞")} className={`p-3 text-lg rounded-lg cursor-pointer ${mood === "😞" && `bg-base-300`}`}>😞</p>
                            <p onClick={() => setMood("😢")} className={`p-3 text-lg rounded-lg cursor-pointer ${mood === "😢" && `bg-base-300`}`}>😢</p>
                        </div>
                        <div className={`relative w-full`}>
                            <textarea 
                                value={entryContent} 
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    if (newValue.length <= 150 || newValue.length < entryContent.length) {
                                    setEntryContent(newValue);
                                    }
                                }} 
                                className="textarea w-full my-3" 
                                placeholder="Write a little bit about your mood..."
                            ></textarea>
                            <span className={`text-sm absolute bottom-4 right-3 ${entryContent.length < 150 ? `text-black` : `text-error`}`}>
                                {entryContent.length}/150
                            </span>
                        </div>
                        <button onClick={submitEntry} className={`btn btn-neutral text-neutral-content ml-auto`}>Submit Journal Entry</button>
                    </div>
                </div>
                <div className={`col-span-4 flex flex-col gap-2`}>
                    <div className={`p-5 rounded-lg bg-base-100 border border-base-300`}>
                        <p className={`text-base-content font-medium mb-2 flex items-center gap-2`}><PiSparkleFill size={25} className={`fill-yellow-500`} />Weekly Summary</p>
                        {summary === undefined ? (<VscLoading size={30} className={`mx-auto animate-spin`} />) : (<p className={``}>{summary}</p>)}
                    </div>
                    <div className={`p-5 rounded-lg bg-base-100 border border-base-300`}>
                        <p className={`text-base-content font-medium mb-2 flex items-center gap-2`}><PiStarFill size={25} className={`fill-yellow-500`} />How to Feel Better</p>
                        {improvement === undefined ? (<VscLoading size={30} className={`mx-auto animate-spin`} />) : (<p className={``} dangerouslySetInnerHTML={{ __html: improvement }}></p>)}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}