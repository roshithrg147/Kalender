"use client";

import { useEffect, useState } from "react";

export default function ValidationKey() {
  const [key, setKey] = useState<string | null>(null);

  useEffect(() => {
    fetch("/validation-key.txt")
      .then((res) => res.text())
      .then((data) => setKey(data.trim()))
      .catch((err) => console.error("Error fetching validation key:", err));
  }, []);

  return <div>{key ?? "Loading..."}</div>;
}
