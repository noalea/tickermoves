import { RowDataPacket } from "mysql2";
import pool from "../config/db";
import { PressReleasesResponse } from "@tickermoves/shared-types";

type PressReleaseCountResult = { total: number };

export const fetchPressReleases = async (limit: number, page: number) => {
    const offset = (page - 1) * limit;

    const query = `
        SELECT id, tickers, title, url, created, analysis, analysis_reasoning AS analysisReasoning
        FROM releases
        ORDER BY created DESC
        LIMIT ? OFFSET ?;
    `;

    const countQuery = `SELECT COUNT(*) as total FROM releases;`;

    // Execute queries
    const [pressReleases] = await pool.query(query, [limit, offset]);
    const [countRows] = await pool.query<RowDataPacket[]>(countQuery);

    // Safely extract total count
    const total = (countRows?.[0] as PressReleaseCountResult).total || 0;

    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: pressReleases,
    } as PressReleasesResponse
};