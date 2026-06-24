import { ApplicationFilters, SortDateType, SortingFilterType } from "@/types/applications.types";
import loans from "../../../data/loans.json"
import { useMemo, useState } from "react"
import { Loan } from "@/types/loans.types";


export const useApplications = () => {
    const [limit, setLimit] = useState<number>(50);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [filter, setFilter] = useState<ApplicationFilters>({
        status: null,
        riskCategory: null
    })
    const [sortFilter, setSortFilter] = useState<SortingFilterType>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [loading, setLoading] = useState<boolean>(false)
    const [sortDateType, setSortDateType] = useState<SortDateType>(null)

    const [searchQuery, setSearchQuery] = useState<string>("");

    const [viewAllData, setViewAllData] = useState(true)

    console.log("search query is :", searchQuery);

    const wait = () => new Promise((res) => setTimeout(res, 400))

    const filteredLoanData = useMemo(() => {
        // Because loans.json is imported as a raw JSON file, TypeScript sees properties like 'loanType' as generic "string", 
        // while your 'Loan' interface expects a strict union (e.g., "Personal" | "Business"). 
        // You have to cast through "unknown" to force TypeScript to accept the assignment.
        const loasnData = [...loans] as unknown as Loan[];

        const filteredData = loasnData.filter((loanDat: Loan) => {

            // Check Status and Risk Category
            if (filter.status && loanDat.status !== filter.status) return false;
            if (filter.riskCategory && loanDat.riskCategory !== filter.riskCategory) return false;

            return true;
        })

        if (sortFilter) {
            filteredData.sort((a: Loan, b: Loan) => {
                if (sortFilter === "date" && sortDateType) {
                    const dateA = a[sortDateType] ? new Date(a[sortDateType] as string).getTime() : 0;
                    const dateB = b[sortDateType] ? new Date(b[sortDateType] as string).getTime() : 0;

                    if (sortOrder === "asc") return dateA - dateB;
                    return dateB - dateA;
                }

                if (sortFilter === "loanAmount" || sortFilter === "riskScore") {
                    const valA = a[sortFilter] as number;
                    const valB = b[sortFilter] as number;

                    if (sortOrder === "asc") return valA - valB;
                    return valB - valA;
                }

                return 0;
            })
        }

        return filteredData;
    }, [filter, sortFilter, sortOrder, sortDateType])

    const fetchLoanData = async (pageNumber: number, filter: ApplicationFilters, sortFilter: SortingFilterType, sortOrder: "asc" | "desc") => {
        try {
            setLoading(true)
            const skip = (pageNumber - 1) * limit;

            let sliceData = viewAllData ? filteredLoanData : filteredLoanData.slice(skip, skip + limit)

            if (searchQuery) {
                sliceData = sliceData.filter((data: Loan) => {
                    // Check Search Query
                    const lowerQuery = searchQuery.toLowerCase();
                    const matchesName = data.applicantName.toLowerCase().includes(lowerQuery);
                    const matchesId = data.loanId.toLowerCase().includes(lowerQuery);

                    console.log("matches name and id is : ", matchesName, matchesId)
                    if (!matchesName && !matchesId) return false;

                    return true
                })

                console.log("slice data length is : ", sliceData?.length)
            }

            await wait()

            return sliceData

        } catch (err: any) {
            console.log('[ERROR] in fetchLoanData : ', err.message);
            return [];
        } finally {
            setLoading(false)
        }
    }

    const totalItems = filteredLoanData.length;

    return {
        fetchLoanData,
        loading,

        limit, setLimit,
        pageNumber, setPageNumber,

        filter, setFilter,

        sortFilter, setSortFilter,
        sortOrder, setSortOrder,
        sortDateType, setSortDateType,

        searchQuery, setSearchQuery,

        totalItems,
        viewAllData, setViewAllData
    }

}