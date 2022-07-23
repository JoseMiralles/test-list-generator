import React, { useState } from "react";

interface IParams {
    csvString: string;
}

type TDiffculties = 1 | 2 | 3;

interface IProblem {
    title: string;
    url: string;
    difficulty: TDiffculties;
    language?: string;
}

interface IProblemSets {
    easy: IProblem[];
    medium: IProblem[];
    hard: IProblem[];
}

const Generator = ({csvString}: IParams) => {

    const [totalProblems, setTotalProblems] = useState(10);
    const [languages, setLanguages] = useState(["TypeScript", "Python"]);
    const [langFieldVal, setLangFieldVal] = useState("");
    const [generatedProblems, setGeneratedProblems] = useState<IProblem[]>([]);

    const handleRemoveLangButton = (lang: string) => () => {
        setLanguages(languages.filter(l => l != lang));
    };

    const handleAddLangButton = () => {
        if (!langFieldVal.length) return;
        setLanguages(languages.concat([langFieldVal]));
        setLangFieldVal("");
    };

    const handleGenerateButton = () => {
        const problems = csvStringToProblemsArray(csvString);
        setGeneratedProblems(generateList(problems,languages,totalProblems));
    };

    return (
        <div id="generator">

            <div id="controls">
                <div className="input-wrapper">
                    <label htmlFor="total-problems">Total Problems</label>
                    <input
                        id="total-problems"
                        type="number"
                        value={totalProblems}
                        onChange={(i)=>{setTotalProblems(parseInt(i.target.value))}}/>
                </div>
                <div className="input-wrapper">
                    <label htmlFor="add-language">Add Language</label>
                    <input
                        value={langFieldVal}
                        onChange={(e)=>{setLangFieldVal(e.target.value)}}
                        id="add-language"
                        type="text"
                        onSubmit={()=>{handleAddLangButton()}}/>
                    <button onClick={()=>{handleAddLangButton()}}>{"add"}</button>
                </div>
                <div id="language-list">
                    {languages.map((l, i)=>(
                        <div
                            className="lang-item"
                            key={i}>
                            <p>{l}</p>
                            <button onClick={handleRemoveLangButton(l)}>X</button>
                        </div>
                    ))}
                </div>
                <br></br>
                <button onClick={handleGenerateButton} id="generate-button">Generate</button>
            </div>

            <br/>
            <br/>

            <div id="problems-list">
                {generatedProblems.map((p, i) => {
                    return (
                        <div className="problem-item" key={i}>
                            <div className="problem-item-top">
                                <input type="checkbox" name="" id="" />
                                <a href={p.url}><h1>{p.title}</h1></a>
                            </div>
                            <div className="problem-item-info">
                                <p>{p.language}</p>
                                <p>{diffs[p.difficulty - 1]}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default Generator;


const generateList =
    (problems: IProblem[], languages: string[], total: number): IProblem[] => {
        
        let created = 0;
        const problemsArray = getProblems(problems);
        const problemsUsed: Set<string> = new Set();
        const problemsResult: IProblemSets = {easy: [], medium: [], hard: []}
        const totalHardProblems = Math.floor(total * 0.1) // 10% of problems will be hard
        const totalMedProblems = Math.floor(total * 0.2) // 20% of  problems will be medium
        const totalEasyProblems = total - totalHardProblems - totalMedProblems;

        let langIdx = 0;

        while (problemsResult.easy.length < totalEasyProblems) {
            const idx = Math.floor(Math.random() * problemsArray.easy.length);
            const current = problemsArray.easy[ idx ];
            if (!problemsUsed.has(current.title)) {
                current.language = languages[langIdx];
                langIdx = (langIdx + 1) % languages.length;
                problemsResult.easy.push(current);
            }
        }

        while (problemsResult.medium.length < totalMedProblems) {
            const idx = Math.floor(Math.random() * problemsArray.medium.length);
            const current = problemsArray.medium[ idx ];
            if (!problemsUsed.has(current.title)) {
                current.language = languages[langIdx];
                langIdx = (langIdx + 1) % languages.length;
                problemsResult.medium.push(current);
            }
        }

        while (problemsResult.hard.length < totalHardProblems) {
            const idx = Math.floor(Math.random() * problemsArray.hard.length);
            const current = problemsArray.hard[ idx ];
            if (!problemsUsed.has(current.title)) {
                current.language = languages[langIdx];
                langIdx = (langIdx + 1) % languages.length;
                problemsResult.hard.push(current);
            }
        }

        return [...problemsResult.easy, ...problemsResult.medium, ...problemsResult.hard];
};

const csvStringToProblemsArray = (csvString: string): IProblem[] => {
    const raw_problems: string[] = csvString.split("\n").slice(1);
    return raw_problems.map(raw => {
        const p = raw.split(",");
        // @ts-ignore
        const difficulty: TDiffculties = parseInt(p[2]);
        return {
            title: p[0],
            url: p[1],
            difficulty
        };
    });
};


const diffs: (keyof IProblemSets)[] = ["easy", "medium", "hard"];

function getProblems(problems: IProblem[]): IProblemSets {
    const res: IProblemSets = {
        easy: [], medium: [], hard: []
    };

    problems.forEach(p => {
        const item = res[ diffs[p.difficulty - 1] ];
        item.push(p)
    });

    return res;
}

