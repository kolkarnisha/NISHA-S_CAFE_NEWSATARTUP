# NISHA-S_CAFE_NEWSATARTUP
print("NISHA`S CAFE NEWSTARTUP")
print("***nisha`s cafe newstartupp*** ")
menu = {
    "mocha": 150,
    "capchunio": 120,
    "latte": 100,
    "coldcoffe": 80,
    "blackcofee": 50
}
icecream = {"mocha":20,"capchunio":15,"latte":10,"coldcoffe":5,"blackcofee":0}
topping  = {"mocha":30,"capchunio":25,"latte":20,"coldcoffe":10,"blackcofee":0}
sugar    = {"mocha":10,"capchunio":8,"latte":5,"coldcoffe":5,"blackcofee":0}
def cafe_bill(order, quantity):
    total_price = menu[order] + icecream[order] + topping[order] + sugar[order]
    if total_price > 200:
        discount = total_price * 0.10
    else:
        discount = 0
    final_price = total_price - discount
    bill = final_price * quantity
    points = bill // 100
    print("your order bill payment")
    print(f"Order: {order} x {quantity}")
    print(f"Total Price (before discount): {total_price}")
    print(f"Discount: {discount}")
    print(f"Final Price per item: {final_price}")
    print(f"Total Bill: {bill}")
    print(f"Loyalty Points Earned: {points}")
print(menu)
cafe_bill("mocha", 2)
cafe_bill("coldcoffe",5)
