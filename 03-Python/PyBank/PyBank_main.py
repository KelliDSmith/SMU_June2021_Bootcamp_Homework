
import os
import csv
import numpy as ny

csvpath = os.path.join("PyBank\\Resources\\budget_data.csv")

with open(csvpath) as csvfile:

    csvreader = csv.reader(csvfile, delimiter=',')

    csv_header = next(csvreader)

    #create empty list to store csv data and calucated monthly change
    months = []
    profits = []
    monthly_change = []
    
    all_rows = [csvreader]
    for row in csvreader:
        #store all rows as lists and cast 2nd column as integer
        months.append(row[0])
        profits.append(int(row[1]))
        

    #number of months equals the length of data set, 1 row per month
    total_months = (len(months))

    total_profit = sum(profits)

    #perform look ahead to calucate monthly profit changes and append to monthly_changes list
    for i in range(len(profits)-1):
        curr_profit = profits[i]
        next_profit = profits[i+1]

        changes = next_profit-curr_profit
        monthly_change.append(changes)

    #calc average profit change using numpy mean function
    average_change = round(ny.mean(monthly_change),2)

    #use min/max functions to define min/max profit change variables
    max_change = max(monthly_change)
    min_change = min(monthly_change)

    #locate months of greatest increase/decrease
    increase_month = months[monthly_change.index(max_change)+1]
    decrease_month = months[monthly_change.index(min_change)+1]

    #print to terminal   
    print("Financial Analysis\n")
    print("----------------------------------------------------------\n")
    print(f"Total Months: {total_months}\n")
    print(f"Total: ${total_profit}\n")
    print(f"Average Change: ${average_change}\n")
    print(f"Greatest Increase in Profits: {increase_month} (${max_change})\n")
    print(f"Greatest Decrease in Profits: {decrease_month} (${min_change})\n")

#print to txt file
output_path = "PyBank\\Analysis\\PyBank_results.txt"
with open(output_path, 'w') as text:
    text.write("Financial Analysis\n")
    text.write("----------------------------------------------------------\n")
    text.write(f"Total Months: {total_months}\n")
    text.write(f"Total: ${total_profit}\n")
    text.write(f"Average Change: ${average_change}\n")
    text.write(f"Greatest Increase in Profits: {increase_month} (${max_change})\n")
    text.write(f"Greatest Decrease in Profits: {decrease_month} (${min_change})\n")