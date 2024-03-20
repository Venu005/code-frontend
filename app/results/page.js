"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import copy from "clipboard-copy";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
const Results = () => {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [output, setOutput] = useState({});
  const language_id = {
    "C++": 54,
    Python: 71,
    JavaScript: 93,
    Java: 91,
  };

  const runCode = async (code, stdin, language, id) => {
    const timestamp = new Date();
    language = language.charAt(0).toUpperCase() + language.slice(1);
    const url =
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({
        source_code: Buffer.from(code).toString("base64"),
        language_id: language_id[language],
        stdin: Buffer.from(stdin).toString("base64"),
      }),
    };

    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(url, options);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const result = await res.json();
        const token = result.token;
        const checkInterval = setInterval(async () => {
          const resultResponse = await fetch(
            `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
            {
              headers: {
                "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
              },
            }
          );
          if (!resultResponse.ok) {
            clearInterval(checkInterval);
            reject(`HTTP error! status: ${resultResponse.status}`);
          }
          const resultData = await resultResponse.json();

          if (resultData.status && resultData.status.id > 2) {
            clearInterval(checkInterval);
            setOutput((prevOutput) => ({
              ...prevOutput,
              [id]: {
                ans: resultData.stdout,
                time: timestamp,
              },
            }));
            resolve();
          }
        }, 3000);
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: "Running code...",
      success: "Code ran successfully",
      error: "Error running code",
    });
  };

  const toggleCodeVisibility = (id) => {
    if (visible === id) {
      setVisible(null);
    } else {
      setVisible(id);
    }
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleCopyClick = async (text) => {
    try {
      await copy(text);
      setIsCopied(true);
      toast.success("Code copied to clipboard");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`https://backend-9how.onrender.com/results`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setData(data);
    };
    fetchData();
  }, []);

  return (
    <Table>
      <TableCaption>Recent Submissions</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>UserName</TableHead>
          <TableHead>Coding Language</TableHead>
          <TableHead>STDIN</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Time Stamp</TableHead>
          <TableHead>Output</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id} className="mb-4">
            <TableCell>{row.username}</TableCell>
            <TableCell>{capitalizeFirstLetter(row.codinglanguage)}</TableCell>
            <TableCell>
              <pre>{row.stdcin}</pre>
            </TableCell>
            <TableCell onClick={() => toggleCodeVisibility(row.id)}>
              <div className="mb-4 border-2 border-gray-500 p-2 cursor-pointer rounded-lg">
                {visible === row.id || row.code.length <= 100 ? (
                  <pre>{row.code}</pre>
                ) : (
                  <pre>{row.code.substring(0, 100) + "..."}</pre>
                )}
                <Button
                  onClick={() => handleCopyClick(row.code)}
                  className="mr-2"
                >
                  Copy
                </Button>
                <Button
                  onClick={() =>
                    runCode(row.code, row.stdcin, row.codinglanguage, row.id)
                  }
                >
                  RunCode
                </Button>
              </div>
            </TableCell>
            <TableCell>
              {output[row.id] ? output[row.id].time.toLocaleString() : ""}
            </TableCell>
            <TableCell>{output[row.id] ? output[row.id].ans : ""}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Results;
