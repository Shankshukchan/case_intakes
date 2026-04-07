// Case search and filter component

import { useState } from "react";
import { CaseFilters as CaseFiltersType, CaseStage } from "../types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";
import { Search, X } from "lucide-react";

interface CaseFiltersProps {
  onFiltersChange: (filters: CaseFiltersType) => void;
}

const STAGES: CaseStage[] = ["Filing", "Evidence", "Arguments", "Order Reserved"];

export function CaseFilters({ onFiltersChange }: CaseFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [stage, setStage] = useState<CaseStage | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const applyFilters = () => {
    const filters: CaseFiltersType = {};
    
    if (searchQuery.trim()) {
      filters.searchQuery = searchQuery.trim();
    }
    
    if (stage !== "all") {
      filters.stage = stage;
    }
    
    if (dateFrom) {
      filters.dateFrom = dateFrom;
    }
    
    if (dateTo) {
      filters.dateTo = dateTo;
    }
    
    onFiltersChange(filters);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStage("all");
    setDateFrom("");
    setDateTo("");
    onFiltersChange({});
  };

  const hasActiveFilters = searchQuery || stage !== "all" || dateFrom || dateTo;

  return (
    <Card className="p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Search */}
        <div className="lg:col-span-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative mt-1.5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Case title or client name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              className="pl-9"
            />
          </div>
        </div>

        {/* Stage Filter */}
        <div>
          <Label htmlFor="stage">Stage</Label>
          <Select value={stage} onValueChange={(value) => setStage(value as CaseStage | "all")}>
            <SelectTrigger id="stage" className="mt-1.5">
              <SelectValue placeholder="All stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {STAGES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date From */}
        <div>
          <Label htmlFor="dateFrom">Hearing From</Label>
          <Input
            id="dateFrom"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="mt-1.5"
          />
        </div>

        {/* Date To */}
        <div>
          <Label htmlFor="dateTo">Hearing To</Label>
          <Input
            id="dateTo"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="mt-1.5"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Button onClick={applyFilters} size="sm">
          <Search className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
        {hasActiveFilters && (
          <Button onClick={clearFilters} variant="outline" size="sm">
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </Card>
  );
}
