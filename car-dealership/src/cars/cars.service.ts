import { Injectable, NotFoundException } from '@nestjs/common';
import { Car } from './interfaces/car.interface';
import { v4 as uuid } from 'uuid';
import { CreateCarDto, UpdateCarDto } from './dto';

@Injectable()
export class CarsService {

    private cars: Car[] = [

    ];

    findAll() {
        return this.cars;
    }

    findOneById(id: string) {
        const car = this.cars.find(car => car.id === id);
        if (!car)
            throw new NotFoundException(`Car with id ${id} not found`);

        return car;
    }

    create(createCarDto: CreateCarDto) {
        const car: Car = {
            id: uuid(),
            ...createCarDto
        }
        this.cars.push(car);
        return car;
    }

    update(id: string, updateCarDto: UpdateCarDto) {
        this.findOneById(id); // ensure car exists, throws if not

        const updates = Object.fromEntries(
            Object.entries(updateCarDto).filter(([, v]) => v !== undefined)
        ) as Partial<UpdateCarDto>;

        this.cars = this.cars.map((car) =>
            car.id === id ? { ...car, ...updates, id } : car
        );

        return this.findOneById(id);
    }

    delete(id: string) {
        this.findOneById(id); // ensure car exists, throws if not
        this.cars = this.cars.filter(car => car.id !== id);
        return this.cars;
    }

    fillCarsWithSeedData(cars: Car[]) {
        this.cars = cars;
        return this.cars;
    }

}
