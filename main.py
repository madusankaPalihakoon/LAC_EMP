import re
from datetime import datetime

input_file = "emp.sql"
output_file = "employees_fixed.sql"


def convert_date(date_str):
    date_str = date_str.strip()

    if date_str == "":
        return "NULL"

    formats = [
        "%d/%m/%Y",
        "%d/%m/%y",
        "%m/%d/%Y",
        "%m/%d/%y",
        "%d.%m.%Y",
        "%d.%m.%y",
    ]

    for fmt in formats:
        try:
            return f"'{datetime.strptime(date_str, fmt).strftime('%Y-%m-%d')}'"
        except ValueError:
            continue

    print(f"Could not parse: {date_str}")
    return "NULL"


with open(input_file, "r", encoding="utf-8") as f:
    lines = f.readlines()

fixed_lines = []

for line in lines:
    if "VALUES" not in line:
        fixed_lines.append(line)
        continue

    values = re.findall(r"'([^']*)'", line)

    if len(values) >= 7:
        values[4] = convert_date(values[4])  # date_joined
        values[6] = convert_date(values[6])  # date_of_birth

        rebuilt = (
            f"INSERT INTO `employees` "
            f"(`epf_no`, `center`, `employee_name`, `designation`, "
            f"`date_joined`, `identity_card_number`, `date_of_birth`) VALUES "
            f"('{values[0]}', '{values[1]}', '{values[2]}', '{values[3]}', "
            f"{values[4]}, '{values[5]}', {values[6]});\n"
        )

        fixed_lines.append(rebuilt)
    else:
        fixed_lines.append(line)

with open(output_file, "w", encoding="utf-8") as f:
    f.writelines(fixed_lines)

print(f"Done! Saved as {output_file}")