const vndFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
});

function currencyFormat(number: number) : string {
    return vndFormatter.format(number) || "";
}


function formatNumber(input : number) : string {
    if (Number.isInteger(input)) {
        // Nếu là số nguyên, trả về nguyên gốc (loại bỏ phần thập phân)
        return input.toString();
    } else {
        // Nếu là số thực, làm tròn 2 chữ số thập phân
        return input.toFixed(2);
    }
}

export { currencyFormat, formatNumber };
