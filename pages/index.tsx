import { ReactElement, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";

const regions: string[] = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon",
];

const Home: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [data, setData] = useState({});
  const [income, setIncome] = useState<number>();
  const [from, setFrom] = useState<string>("hour");
  const [region, setRegion] = useState<string>("Alberta");

  const submit = async (): Promise<void> => {
    setLoading(true);
    setError(false);
    const response: Response = await fetch(
      `/api/tax?salary=${income}&from=${from}&region=${region}`
    );
    const data = await response.json();

    setData(data);
  };

  return (
    <div>
      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>): void => {
          e.preventDefault();
          submit();
        }}
      >
        <span>
          <label htmlFor={"income"}>Income</label>
          <input
            step={0.01}
            value={income}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
              setIncome(parseFloat(e.target.value));
            }}
            type={"number"}
            id={"income"}
            placeholder={"income"}
          />
        </span>
        <span>
          <label htmlFor={"from"}>Income</label>
          <select
            onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
              setFrom(e.target.value.toLowerCase());
            }}
            id={"from"}
            placeholder={"income"}
          >
            {["Hour", "Day", "Week", "Month", "Year"].map(
              (value: string): ReactElement => (
                <option key={value}>{value}</option>
              )
            )}
          </select>
        </span>
        <span>
          <label htmlFor={"region"}>Region</label>
          <select
            onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
              setRegion(e.target.value);
            }}
            id={"region"}
            placeholder={"Region"}
          >
            {regions.map(
              (region: string): ReactElement => (
                <option key={region}>{region}</option>
              )
            )}
          </select>
        </span>
        <button type={"submit"}>Submit</button>
      </form>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default Home;
