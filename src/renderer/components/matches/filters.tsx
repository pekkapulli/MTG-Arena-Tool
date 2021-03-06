import _ from "lodash";
import matchSorter from "match-sorter";
import React from "react";
import { ColumnInstance, FilterValue, Row } from "react-table";
import { RankSymbol } from "../misc/RankSymbol";
import { BinaryColumnFilter, BinaryFilterValue } from "../tables/filters";
import { MultiSelectFilterProps } from "../tables/types";
import { useMultiSelectFilter } from "../tables/useMultiSelectFilter";
import { MatchTableData } from "./types";
import indexCss from "../../index.css";
import { constants } from "mtgatool-shared";
const { MANA, RANKS } = constants;

export function OnPlayColumnFilter(props: {
  column: ColumnInstance<MatchTableData>;
}): JSX.Element {
  return (
    <BinaryColumnFilter
      {...props}
      trueSymbol={"P"}
      trueLabel={"On the play"}
      falseSymbol={"D"}
      falseLabel={"On the draw"}
    />
  );
}

export function onPlayFilterFn(
  rows: Row<MatchTableData>[],
  _id: string,
  filterValue: BinaryFilterValue
): Row<MatchTableData>[] {
  return rows.filter((row) =>
    Object.entries(filterValue).some(
      ([code, value]) => value && String(row.original.isOnPlay) === code
    )
  );
}

type RankFilterKeys =
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Diamond"
  | "Mythic";

type RankFilterValue = { [key in RankFilterKeys]: boolean };

const defaultRank: RankFilterValue = {
  Bronze: true,
  Silver: true,
  Gold: true,
  Platinum: true,
  Diamond: true,
  Mythic: true,
};

type RankFilterProps = MultiSelectFilterProps<RankFilterValue>;

function RankFilter(props: RankFilterProps): JSX.Element {
  const [filterValue, onClickMultiFilter] = useMultiSelectFilter(props);
  return (
    <div
      className={"collection_table_query_rank"}
      style={{
        display: "flex",
        height: "32px",
      }}
    >
      {RANKS.map((code: RankFilterKeys) => {
        return (
          <RankSymbol
            rank={code}
            key={code}
            onClick={onClickMultiFilter(code)}
            className={filterValue[code] ? "" : indexCss.rarityFilterOn}
            title={code}
          />
        );
      })}
    </div>
  );
}

export function RankColumnFilter({
  column: { id, filterValue = { ...defaultRank }, setFilter },
}: {
  column: ColumnInstance<MatchTableData>;
}): JSX.Element {
  return (
    <RankFilter
      filterKey={id}
      filters={{ [id]: filterValue }}
      onFilterChanged={(filterValue): void => {
        if (_.isMatch(filterValue, defaultRank)) {
          setFilter(undefined); // clear filter
        } else {
          setFilter(filterValue);
        }
      }}
    />
  );
}

export function rankFilterFn(
  rows: Row<MatchTableData>[],
  columnIds: string[],
  filterValue: RankFilterValue
): Row<MatchTableData>[] {
  return rows.filter((row) =>
    Object.entries(filterValue).some(
      ([code, value]) => value && row.values[columnIds[0]] === code
    )
  );
}

const colorSearchKeyFactory = (
  colorKey: string
): ((row: Row<MatchTableData>) => string) => {
  return (row: Row<MatchTableData>): string => {
    const colors = row.values[colorKey];
    return colors.map((color: number): string => MANA[color]).join(" ");
  };
};

export function matchSearchFilterFn(
  rows: Row<MatchTableData>[],
  _columnIds: string[],
  filterValue: FilterValue
): Row<MatchTableData>[] {
  const tokens = String(filterValue)
    .split(" ")
    .filter((token) =>
      token.includes(":") ? token.split(":")[1].length > 2 : token.length > 2
    );
  if (tokens.length === 0) {
    return rows;
  }
  const matches = tokens.map((token) => {
    return matchSorter(rows, token, {
      keys: [
        "values.deckName",
        "values.oppArchetype",
        "values.oppName",
        "values.deckTags",
        "values.tags",
        colorSearchKeyFactory("colors"),
        colorSearchKeyFactory("oppColors"),
      ],
    });
  });
  return _.intersection(...matches);
}
