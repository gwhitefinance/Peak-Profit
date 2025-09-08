import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
  PaginationItem
} from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Withdrawal {
  date: string;
  amount: number;
  method: string;
  status: "Paid" | "Pending" | "Rejected";
  transactionId: string;
}

interface PayoutsTableProps {
  withdrawals: Withdrawal[];
}

export default function PayoutsTable({ withdrawals }: PayoutsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(withdrawals.length / itemsPerPage);
  const currentItems = withdrawals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: "Paid" | "Pending" | "Rejected") => {
    let colorClass = "";
    let dotColor = "";
    switch (status) {
      case "Paid":
        colorClass = "text-green-300 bg-green-900/50";
        dotColor = "bg-green-400";
        break;
      case "Pending":
        colorClass = "text-yellow-300 bg-yellow-900/50";
        dotColor = "bg-yellow-400";
        break;
      case "Rejected":
        colorClass = "text-red-300 bg-red-900/50";
        dotColor = "bg-red-400";
        break;
    }
    return (
      <Badge
        className={cn(
          "font-semibold inline-flex items-center text-xs px-2 py-1",
          colorClass
        )}
      >
        <span className={cn("w-2 h-2 rounded-full mr-1.5", dotColor)}></span>
        {status}
      </Badge>
    );
  };

  return (
    <Card className="rounded-lg bg-card">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-foreground">Withdrawal History</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Date</TableHead>
              <TableHead className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Amount</TableHead>
              <TableHead className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Method</TableHead>
              <TableHead className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Transaction ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {currentItems.map((withdrawal, index) => (
              <TableRow key={index} className="hover:bg-accent/50">
                <TableCell className="p-4 whitespace-nowrap text-sm font-medium text-foreground">{withdrawal.date}</TableCell>
                <TableCell className="p-4 whitespace-nowrap font-medium text-foreground">
                  ${withdrawal.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="p-4 whitespace-nowrap text-muted-foreground text-sm">{withdrawal.method}</TableCell>
                <TableCell className="p-4 whitespace-nowrap">
                  {getStatusBadge(withdrawal.status)}
                </TableCell>
                <TableCell className="p-4 font-mono text-sm text-muted-foreground">{withdrawal.transactionId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="p-4 flex justify-between items-center text-sm text-muted-foreground border-t border-border">
        <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, withdrawals.length)} of {withdrawals.length} entries</span>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={cn(currentPage === 1 ? 'pointer-events-none opacity-50' : '')}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={cn(currentPage === totalPages ? 'pointer-events-none opacity-50' : '')}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </Card>
  );
}